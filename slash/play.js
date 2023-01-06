const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { QueryType, Playlist, Track } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(":raccoon: Odtwarza utwór z YouTube bądź Spotify")
        .addStringOption((option) => option.setName("insert").setDescription("Link bądź słowa kluczowe").setRequired(true)),

    run: async ({ client, interaction }) => {
        // EmbedBuilder
        let embed = new EmbedBuilder();

        // Check voice connection
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: Musisz być połączony z czatem głosowym, aby użyć tej komendy")
                ]
            });
        }

        // Queue object declaration
        const QUEUE = await client.player
            .createQueue(
                interaction.guild,
                {
                    // Bot will now disconnect after 10 mins of inactivity and will join the voice unmuted
                    leaveOnEndCooldown: 600000,
                    autoSelfDeaf: false
                }
            );

        // Bot connection to the voice channel
        if (!QUEUE.connection) await QUEUE.connect(interaction.member.voice.channel)

        // Getting the users input
        let insert = interaction.options.getString("insert");

        try {
            // Handling SPOTIFY SONG
            if (insert.startsWith("https://open.spotify.com/track/")) {

                const SEARCH_RESULT = await client.player.search(insert, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_SONG
                })

                // If no results were found
                if (SEARCH_RESULT.tracks.length === 0) {
                    return interaction.editReply({
                        embeds: [
                            embed
                                .setColor(0xFFFFFF)
                                .setTitle(":raccoon: Nie znaleziono podanego utworu")
                        ]
                    });
                }

                // Declaring song searched for
                const SONG = SEARCH_RESULT.tracks[0];

                // Adding the song to the queue
                await QUEUE.addTrack(SONG);
                embed
                    .setColor(0xFFFFFF)
                    .setTitle(`${SONG.title}`)
                    .setDescription(`dodano do kolejki`)
                    .setThumbnail(SONG.thumbnail)
                    .setFooter({ text: `Długość: ${SONG.duration} ` });
            }

            // Handling SPOTIFY ALBUM AND PLAYLIST
            // Since discord-player handles it like the same case in switch:
            // case QueryType.SPOTIFY_PLAYLIST:
            // case QueryType.SPOTIFY_ALBUM:
            if (insert.startsWith("https://open.spotify.com/playlist/") || insert.startsWith("https://open.spotify.com/album/")) {
                const SEARCH_RESULT = await client.player.search(insert, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_PLAYLIST
                })

                // Create playlist constraint
                const PLAYLIST = SEARCH_RESULT.playlist;

                // Add tracks from playlist to the queue
                await QUEUE.addTracks(PLAYLIST.tracks);

                // Set embed
                embed
                    .setColor(0xFFFFFF)
                    .setDescription(`**${PLAYLIST.tracks.length} utworów z [${PLAYLIST.title}](${PLAYLIST.url})** zostało dodanych do kolejki`)
                    .setThumbnail(PLAYLIST.thumbnail)
            }

            // Handling YOUTUBE PLAYLIST
            if (insert.startsWith("https://youtube.com/playlist?")) {
                const SEARCH_RESULT = await client.player.search(insert, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })

                const PLAYLIST = SEARCH_RESULT.playlist
                await QUEUE.addTracks(SEARCH_RESULT.tracks)
                embed
                    .setDescription(`**${SEARCH_RESULT.tracks.length} utworów z [${PLAYLIST.title}](${PLAYLIST.url})** zostało dodanych do kolejki`)
                    .setThumbnail(PLAYLIST.thumbnail)
            }
            // Handling TYPOS, OTHER SEARCHES FOR INDIVIDUAL TRACKS

        } catch (e) {
            console.log(e);
        }

        // if (interaction.options.getSubcommand() === "song") {
        //     let url = interaction.options.getString("url");
        //     if (url.startsWith("https://open.spotify.com/track/")) {
        //         // code to handle Spotify link
        //         const result = await client.player.search(url, {
        //             requestedBy: interaction.user,
        //             searchEngine: QueryType.SPOTIFY_SONG
        //         })

        //         if (result.tracks.length === 0)
        //             return interaction.editReply({
        //                 embeds: [
        //                     embed
        //                         .setColor(0xFFFFFF)
        //                         .setTitle(":raccoon: Nie znaleziono podanego utworu")
        //                 ]
        //             });

        //         const song = result.tracks[0];

        //         await QUEUE.addTrack(song);
        //         embed
        //             .setColor(0xFFFFFF)
        //             .setTitle(`${song.title}`)
        //             .setDescription(`dodano do kolejki`)
        //             .setThumbnail(song.thumbnail)
        //             .setFooter({ text: `Długość: ${song.duration} ` });
        //     } else {
        //         // code to handle YouTube link
        //         const result = await client.player.search(url, {
        //             requestedBy: interaction.user,
        //             searchEngine: QueryType.YOUTUBE_VIDEO
        //         })
        //         if (result.tracks.length === 0)
        //             return interaction.editReply({
        //                 embeds: [
        //                     embed
        //                         .setColor(0xFFFFFF)
        //                         .setTitle(":raccoon: Nie znaleziono podanego utworu")
        //                 ]
        //             });

        //         const song = result.tracks[0];
        //         await QUEUE.addTrack(song);

        //         embed
        //             .setColor(0xFFFFFF)
        //             .setTitle(`${song.title}`)
        //             .setDescription(`dodano do kolejki`)
        //             .setThumbnail(song.thumbnail)
        //             .setFooter({ text: `Długość: ${song.duration} ` });
        //     }

        //     } else if(interaction.options.getSubcommand() === "search") {
        //     let url = interaction.options.getString("searchterms")
        //     const result = await client.player.search(url, {
        //         requestedBy: interaction.user,
        //         searchEngine: QueryType.AUTO
        //     })

        //     if (result.tracks.length === 0)
        //         return interaction.editReply(":raccoon: Nie znaleziono podanego utworu");

        //     const song = result.tracks[0]
        //     await queue.addTrack(song)
        //     embed
        //         .setColor(0xFFFFFF)
        //         .setTitle(`${song.title}`)
        //         .setDescription(`dodano do kolejki`)
        //         .setThumbnail(song.thumbnail)
        //         .setFooter({ text: `Długość: ${song.duration} ` });
        // }

        // Starts playing the queue
        if (!QUEUE.playing) {
            await QUEUE.play();
        }

        // Returns the embed onto the text channel
        await interaction.editReply({
            embeds: [embed]
        })
    }
}