const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to the specified track of the queue")
        .setNameLocalizations({
            pl: 'Pomija kolejkę do podanego w kolejności utworu'
        })
        .addIntegerOption((option) => option.setName("num").setDescription("Track number").setDescriptionLocalizations({
            pl: 'Numer utworu w kolejce'
        }).setRequired(true)),

    run: async ({ client, interaction }) => {

        let embed = new EmbedBuilder();

        const queue = client.player.getQueue(interaction.guild);

        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: You have to be connected to voice chat to use this command")
                ]
            });
        }

        if (!queue || queue.tracks.length == 0) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("No tracks to skip to")
                ]
            });
        }

        let number = interaction.options.getInteger("num");

        if (number < 1 || number > queue.tracks.length) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Invalid input")
                ]
            });
        }

        queue.skipTo(queue.tracks[number - 1]);

        return interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle("Successfully skipped")
            ]
        });

    }
}