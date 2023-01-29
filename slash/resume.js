const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setNameLocalizations({
            pl: 'ponow'
        })
        .setDescription("Resumes playing stopped track")
        .setDescriptionLocalizations({
            pl: "Ponownie odtwarza zatrzymany utwór"
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
                        .setTitle(":raccoon: You have to be connected to voice chat to use this command")
                ]
            });
        }

        queue.setPaused(false);

        return await interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle("Resuming playing the queue")
            ]
        });
    }
} 