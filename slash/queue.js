const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Wyświetla bieżącą kolejkę odtwarzania")
        .addNumberOption((option) => option.setName("strona").setDescription("Numer strony kolejki").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.getQueue(interaction.guildId);


    }
}