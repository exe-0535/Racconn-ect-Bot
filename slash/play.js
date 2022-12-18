const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Odtwarza utwór z YouTube")
        .addSubcommand((subcommand) =>
            subcommand.setName("song")
                .setDescription("Odtwarza utwór z podanego linku")
                .addStringOption((option) => option.setName("url").setDescription("Link do utworu").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("playlist")
                .setDescription("Odtwarza playlistę z podanego linku")
                .addStringOption((option) => option.setName("url").setDescription("Link do playlisty").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("search").setDescription("Wyszukuje i odtwarza utwór na postawie podanych słów kluczowych")
                .addStringOption((option) => option.setName("searchterms").setDescription("Słowa kluczowe do wyszukiwania").setRequired(true))
        ),

    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("Musisz być na kanale głosowym, aby użyć tej komendy");

        const queue = await client.player.createQueue(interaction.guild);
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed();

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Nie znaleziono podanego utworu");

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`**[${song.title}](${song.url})** dodano do kolejki`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Długość: ${song.duration}` })

        } else if (interaction.options.getSubcommand() === "playlist") {

        } else if (interaction.options.getSubcommand() === "search") {

        }
        if (!queue.playing) {
            await queue.play();
        }

        await interaction.editReply({
            embeds: [embed]
        })
    }
}