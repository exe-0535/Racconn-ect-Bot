const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setNameLocalizations({
            pl: 'odtwarzaj'
        })
        .setDescription("Plays song and playlists from YouTube or Spotify")
        .setDescriptionLocalizations({
            pl: 'Odtwarza utwór bądź playlisty z YouTube lub Spotify'
        })
        .addStringOption((option) => option
            .setName("insert")
            .setDescription("Provide link or essential keywords")
            .setDescriptionLocalizations({
                pl: 'Wprowadź link lub niezbędne słowa kluczowe'
            })
            .setRequired(true)),

    run: async ({ client, interaction }) => {
        // EmbedBuilder
        let embed = new EmbedBuilder();

        // Check voice connection
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: You have to be connected to voice chat to use that command")
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
                            .setTitle(":raccoon: Couldn't find any tracks")
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
                .setDescription(`added to queue`)
                .setThumbnail(SONG.thumbnail)
                .setFooter({ text: `Duartion: ${SONG.duration} ` });
        }

        // Handling SPOTIFY ALBUM AND PLAYLIST
        // Since discord-player handles it like the same case in switch:
        // case QueryType.SPOTIFY_PLAYLIST:
        // case QueryType.SPOTIFY_ALBUM:
        else if (insert.startsWith("https://open.spotify.com/playlist/") || insert.startsWith("https://open.spotify.com/album/")) {
            const SEARCH_RESULT = await client.player.search(insert, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST
            })

            // Create playlist constraint
            const PLAYLIST = SEARCH_RESULT.playlist;

            if (SEARCH_RESULT.tracks.length === 0) {
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle(":raccoon: Couldn't find a playlist")
                    ]
                });
            }

            // Add tracks from playlist to the queue
            await QUEUE.addTracks(SEARCH_RESULT.tracks);

            // Set embed
            embed
                .setColor(0xFFFFFF)
                .setDescription(`**${SEARCH_RESULT.tracks.length} tracks from [${PLAYLIST.title}](${PLAYLIST.url})** have been added to queue`)
                .setThumbnail(PLAYLIST.thumbnail)
        }

        // Handling YOUTUBE PLAYLIST
        else if (insert.startsWith("https://youtube.com/playlist?")) {
            const SEARCH_RESULT = await client.player.search(insert, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            const PLAYLIST = SEARCH_RESULT.playlist

            if (SEARCH_RESULT.tracks.length === 0) {
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle(":raccoon: Couldn't find a playlist")
                    ]
                });
            }

            await QUEUE.addTracks(SEARCH_RESULT.tracks);

            embed
                .setColor(0xFFFFFF)
                .setDescription(`**${SEARCH_RESULT.tracks.length} tracks from [${PLAYLIST.title}](${PLAYLIST.url})** have been added to queue`)
                .setThumbnail(PLAYLIST.thumbnail.url)
        }

        // Handling SOUNDCLOUD PLAYLIST

        else if (insert.startsWith("https://soundcloud.com/") && insert.includes("/sets/")) {
            const SEARCH_RESULT = await client.player.search(insert, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SOUNDCLOUD_PLAYLIST
            })

            const PLAYLIST = SEARCH_RESULT.playlist;

            if (SEARCH_RESULT.tracks.length === 0) {
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle(":raccoon: Couldn't find a playlist")
                    ]
                });
            }

            await QUEUE.addTracks(SEARCH_RESULT.tracks);

            embed
                .setColor(0xFFFFFF)
                .setDescription(`**${SEARCH_RESULT.tracks.length} tracks from [${PLAYLIST.title}](${PLAYLIST.url})** have been added to queue`)
                .setThumbnail(PLAYLIST.thumbnail.url)
        }

        // Handling SOUNDCLOUD TRACK

        else if (insert.startsWith("https://soundcloud.com/")) {
            const SEARCH_RESULT = await client.player.search(insert, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SOUNDCLOUD_TRACK
            })

            // If no results were found
            if (SEARCH_RESULT.tracks.length === 0) {
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle(":raccoon: Couldn't find any tracks")
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
                .setDescription(`added to queue`)
                .setThumbnail(SONG.thumbnail)
                .setFooter({ text: `Duartion: ${SONG.duration} ` });



        }


        // Handling YOUTUBE VIDEOS together with KEYWORD-SEARCH
        else {
            const SEARCH_RESULT = await client.player.search(insert, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (SEARCH_RESULT.tracks.length === 0) {
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle(":raccoon: Couldn't find any tracks")
                    ]
                });
            }

            const SONG = SEARCH_RESULT.tracks[0];

            // Adding the song to the queue
            await QUEUE.addTrack(SONG);
            embed
                .setColor(0xFFFFFF)
                .setTitle(`${SONG.title}`)
                .setDescription(`added to queue`)
                .setThumbnail(SONG.thumbnail)
                .setFooter({ text: `Duration: ${SONG.duration} ` });
        }

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