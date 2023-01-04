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

            // Check if the repeat mode is currently set to OFF
            if (queue.repeatMode === QueueRepeatMode.OFF) {
                // If it is, set it to TRACK and send a message
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle("Zapętlam obecnie grający utwór. By wyłączyć zapętlenie użyj /loop")
                    ]
                });
            }
            // If repeat mode is already set to TRACK, set it to OFF and send a message
            else if (queue.repeatMode === QueueRepeatMode.TRACK) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return interaction.editReply({
                    embeds: [
                        embed
                            .setColor(0xFFFFFF)
                            .setTitle("Resuming normal queue playback")
                    ]
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}