const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setNameLocalizations({
            pl: 'pomin'
        })
        .setDescription("Skips the current track")
        .setDescriptionLocalizations({
            pl: `Przesuwa kolejkę o jeden utwór w przód`
        }),

    run: async ({ client, interaction }) => {

        const embed = new EmbedBuilder();

        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || queue.tracks.length === 0) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("No tracks in queue")
                ]
            });
        }

        queue.skip();

        const song = queue.current;
        return await interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle(`Skipped "${song.title}"`)
                    .setDescription(`by ${song.author}`)
            ]
        });
    }
}