const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Rozłącza bota z kanału głosowego"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guild);
        if (queue) {
            queue.stop();
            interaction.editReply("Rozłączono z czatem głosowym");
        } else {
            interaction.editReply("Ten bot nie znajduje się na czacie głosowym");
        }
    },
};