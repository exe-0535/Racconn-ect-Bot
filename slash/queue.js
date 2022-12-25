const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Wyświetla bieżącą kolejkę odtwarzania")
        .addNumberOption((option) => option.setName("page").setDescription("Numer strony kolejki").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return await interaction.editReply("Brak utworów w kolejce")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages)
            return await interaction.editReply(`Nieprawidłowa strona. Aktualnie jest ${totalPages} stron kolejki`)
    }
}