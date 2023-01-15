const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("soundeffect_off")
        .setDescription("Dezaktywuje wszystkie efekty dżwiękowe na kanale głosowym"),

    run: async ({ client, interaction }) => {
        // EmbedBuilder
        let embed = new EmbedBuilder();

        // Check if user is on voice
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: Musisz być połączony z czatem głosowym, aby użyć tej komendy")
                ]
            });
        }

        // Getting queue
        const queue = client.player.getQueue(interaction.guild);

        // Check if queue is active
        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Brak utworów w kolejce")
                ]
            });
        }

        if (queue.getFiltersEnabled().length > 0) {
            queue.setFilters({
                "8D": false,
                slowed_reverb: false,
                bassboost_low: false,
                subboost: false,
                vaporwave: false,
                phaser: false,
                nightcore: false,
                chorus: false
            })
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Wyłączono wszystkie efekty dźwiękowe")
                ]
            });
        } else {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Nie zastosowano żadnego efektu dźwiękowego")
                ]
            });
        }
    }
}