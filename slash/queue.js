const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription(":raccoon: Wyświetla bieżącą kolejkę odtwarzania")
        .addNumberOption((option) => option.setName("page").setDescription("Numer strony kolejki").setMinValue(1)),

    run: async ({ client, interaction }) => {

        let embed = new EmbedBuilder();

        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: Brak utworów w kolejce")
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
                        .setTitle(`:raccoon: Nieprawidłowa strona. Aktualnie jest ${totalPages} stron kolejki`)
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
                    .setDescription(`**Aktualnie odtwarzam:**\n` +
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                        `\n\n**Następnie:**\n${queueString}`
                    )
                    .setFooter({
                        text: `Strona ${page + 1} z ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}