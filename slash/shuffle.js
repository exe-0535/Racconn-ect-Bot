const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Zmienia kolejność odtwarzania kolejki w losowy sposób"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || queue.tracks.length === 0) {
            interaction.editReply("Brak utworów w kolejce");
            return;
        }
        queue.shuffle();
        interaction.editReply("Pomyślnie wymieszano");
    },
};
