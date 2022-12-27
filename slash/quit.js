const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription(":raccoon: Rozłącza bota z kanału głosowego"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guild);
        let embed = new EmbedBuilder();
        if (queue) {
            queue.stop();
            interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Rozłączono z czatem głosowym")
                ]
            });
        } else {
            interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Ten bot nie znajduje się na czacie głosowym")
                ]
            });
        }
    },
};