const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Zapętluje obecnie grający utwór"),
    run: async ({ interaction, client }) => {

    }
}