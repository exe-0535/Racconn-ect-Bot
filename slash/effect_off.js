const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("soundeffect_off")
        .setDescription("Deactivates all sound effects from the current queue")
        .setDescriptionLocalizations({
            pl: 'Dezaktywuje wszystkie efekty dżwiękowe z aktualnej kolejki'
        }),

    run: async ({ client, interaction }) => {
        // EmbedBuilder
        let embed = new EmbedBuilder();

        // Check if user is on voice
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: You have to be connected to a voice channel to use this command")
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
                        .setTitle("No tracks in queue")
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
                chorus: false,
                compressor: false,
                dim: false,
                flanger: false,
                mono: false,
                reverse: false,
                expander: false,
                surrounding: false
            })
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Turned off all the sound effects")
                ]
            });
        } else {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("Couldn't find any sound effects to turn off")
                ]
            });
        }
    }
}