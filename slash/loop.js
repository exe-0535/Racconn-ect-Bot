const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { QueueRepeatMode } = require("discord-player");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Zapętluje obecnie grający utwór"),
    run: async ({ interaction, client }) => {

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

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Brak utworów w kolejce")
                ]
            });
        }

        try {

            if (queue.setRepeatMode(QueueRepeatMode.OFF) === true) {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle("Zapętlam obecnie grający utwór. By wyłączyć zapętlenie użyj /loop")
                    ]
                });
            }

            if (queue.setRepeatMode(QueueRepeatMode.TRACK) === true) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle("Ponownie odtwarzam kolejkę")
                    ]
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}