const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Rozłącza bota z kanału głosowego"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guild);
        let embed = new EmbedBuilder();
        if (queue) {
            queue.stop();
            return interaction.editReply({
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