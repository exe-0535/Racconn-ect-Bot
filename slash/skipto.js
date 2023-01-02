const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Pomija kolejkę do podanego w kolejności utworu")
        .addSubcommand((subcommand) =>
            subcommand.setName("queue_num")
                .setDescription(":raccoon: Przewija do utworu którego numer w kolejce jest podanym numerem")
                .addStringOption((option) => option.setName("num").setDescription("Numer utworu").setRequired(true))
        ),

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

        if (interaction.options.getSubcommand() === "queue_num") {
            let number = interaction.options.getString("num");

            try {
                parseInt(number);
                if (number < 1 || number > queue.tracks.length) {
                    return interaction.editReply({
                        embeds: [
                            embed
                                .setColor(0xFFFFFF)
                                .setTitle("Wprowadzono nieprawidłową wartość")
                        ]
                    });
                }
                queue.skipTo(number);
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle("Pomyślnie pominięto")
                    ]
                });
            } catch (e) {
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle("Wprowadzono nieprawidłową wartość")
                    ]
                });
            }
        }

    }
}