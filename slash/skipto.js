const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Pomija kolejkę do podanego w kolejności utworu")
        .addIntegerOption((option) => option.setName("num").setDescription("Numer utworu").setRequired(true)),

    run: async ({ client, interaction }) => {

        let embed = new EmbedBuilder();

        const queue = client.player.getQueue(interaction.guild);

        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: Musisz być połączony z czatem głosowym, aby użyć tej komendy")
                ]
            });
        }

        if (!queue || queue.tracks.length == 0) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Brak utworów do których można przewinąć")
                ]
            });
        }

        let number = interaction.options.getInteger("num");

        if (number < 1 || number > queue.tracks.length) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Wprowadzono nieprawidłową wartość")
                ]
            });
        }

        queue.skipTo(queue.tracks[number - 1]);

        return interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle("Pomyślnie pominięto")
            ]
        });

    }
}