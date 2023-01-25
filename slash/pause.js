const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the queue")
        .setDescriptionLocalizations({
            pl: 'Wstrzymuje kolejkę'
        }),
    run: async ({ client, interaction }) => {

        let embed = new EmbedBuilder();

        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("No tracks in queue")
                ]
            });
        }

        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: You have to be connected to voice chat to use that command")
                ]
            });
        }

        queue.setPaused(true);

        return await interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle("Paused the queue")
            ]
        });
    }
}