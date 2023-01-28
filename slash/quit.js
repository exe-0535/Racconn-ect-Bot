const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setNameLocalizations({
            pl: 'opusc'
        })
        .setDescription("Disconnects from the voice channel")
        .setDescriptionLocalizations({
            pl: `Rozłącza bota z kanału głosowego`
        }),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guild);
        let embed = new EmbedBuilder();
        if (queue) {
            queue.stop();
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Disconnected from voice channel")
                ]
            });
        } else {
            interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("This bot is not on the voice channel")
                ]
            });
        }
    },
};