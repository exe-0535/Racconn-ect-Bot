const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(":raccoon: Odtwarza utwór z YouTube bądź Spotify")
        .addSubcommand((subcommand) =>
            subcommand.setName("song")
                .setDescription(":raccoon: Odtwarza utwór z podanego linku")
                .addStringOption((option) => option.setName("url").setDescription("Link do utworu").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("search").setDescription(":raccoon: Wyszukuje i odtwarza utwór na postawie podanych słów kluczowych")
                .addStringOption((option) => option.setName("searchterms").setDescription("Słowa kluczowe do wyszukiwania").setRequired(true))
        ),

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


        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url");
            if (url.startsWith("https://open.spotify.com/track/")) {
                // code to handle Spotify link
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_SONG
                })

                if (result.tracks.length === 0)
                    return interaction.editReply({
                        embeds: [
                            embed
                                .setColor(0xFFFFFF)
                                .setTitle(":raccoon: Nie znaleziono podanego utworu")
                        ]
                    });

                const song = result.tracks[0];

                await QUEUE.addTrack(song);
                embed
                    .setColor(0xFFFFFF)
                    .setTitle(`${song.title}`)
                    .setDescription(`dodano do kolejki`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Długość: ${song.duration} ` });
            } else {
                // code to handle YouTube link
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if (result.tracks.length === 0)
                    return interaction.editReply({
                        embeds: [
                            embed
                                .setColor(0xFFFFFF)
                                .setTitle(":raccoon: Nie znaleziono podanego utworu")
                        ]
                    });

                const song = result.tracks[0];
                await QUEUE.addTrack(song);

                embed
                    .setColor(0xFFFFFF)
                    .setTitle(`${song.title}`)
                    .setDescription(`dodano do kolejki`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Długość: ${song.duration} ` });
            }

        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply(":raccoon: Nie znaleziono podanego utworu");

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setColor(0xFFFFFF)
                .setTitle(`${song.title}`)
                .setDescription(`dodano do kolejki`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Długość: ${song.duration} ` });
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