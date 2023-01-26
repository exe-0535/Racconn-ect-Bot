const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setNameLocalizations({
            pl: 'kolejka'
        })
        .setDescription("Shows the current queue")
        .setDescriptionLocalizations({
            pl: 'Wyświetla bieżącą kolejkę odtwarzania'
        })
        .addNumberOption((option) => option.setName("page").setDescription("Queue page")
            .setDescriptionLocalizations({
                pl: "Numer strony kolejki"
            }).setMinValue(1)),

    run: async ({ client, interaction }) => {

        let embed = new EmbedBuilder();

        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: No tracks in queue")
                ]
            })
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(`:raccoon: Invalid page. There's currently ${totalPages} pages`)
                ]
            });
        }

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current


        await interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setDescription(`**Currently playing:**\n` +
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                        `\n\n**Next:**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}