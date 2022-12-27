const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Zmienia kolejność odtwarzania kolejki w losowy sposób"),
    run: async ({ client, interaction }) => {
        const embed = new EmbedBuilder();
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || queue.tracks.length === 0) {
            return await interaction.editReply({
                embeds:
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Brak utworów w kolejce")
            });
        }
        queue.shuffle();
        return await interaction.editReply({
            embeds:
                embed
                    .setColor(0xFFFFFF)
                    .setTitle("Pomyślnie wymieszano")
        });
    },
};
