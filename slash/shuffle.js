const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setNameLocalizations("mieszaj")
        .setDescription("Shuffles the queue")
        .setDescriptionLocalizations({
            pl: "Zmienia kolejność odtwarzania kolejki w losowy sposób"
        }),
    run: async ({ client, interaction }) => {
        const embed = new EmbedBuilder();
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || queue.tracks.length === 0) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("No tracks in queue")
                ]
            });
        }
        queue.shuffle();
        return await interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle("Successfully shuffled")
            ]
        });
    },
};
