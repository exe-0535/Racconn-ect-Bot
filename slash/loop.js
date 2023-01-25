const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loops currently playing track")
        .setDescriptionLocalizations({
            pl: "Zapętluje obecnie grający utwór"
        }),
    run: async ({ interaction, client }) => {

        let embed = new EmbedBuilder();

        const queue = client.player.getQueue(interaction.guild);

        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: You have to be connected to voice chat to use that command")
                ]
            });
        }

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("No tracks in queue")
                ]
            });
        }

        // Check if the repeat mode is currently set to OFF
        if (queue.repeatMode === QueueRepeatMode.OFF) {
            // If it is, set it to TRACK and send a message
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Looping currenty playing track. To unloop use this command again.")
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
                        .setTitle("Unlooped")
                ]
            });
        }
    }
}