const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays information about currently playing track")
        .setDescriptionLocalizations({
            pl: "Wyświetla informacje na temat aktualnie grającego utworu"
        }),

    run: async ({ client, interaction }) => {

        let embed = new EmbedBuilder();
        // Get the current guild's queue
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle("No tracks in queue.")
                ]
            })
        }

        let bar = queue.createProgressBar({
            queue: false,
            length: 32,
            indicator: "🔹",
            line: "·"
        })

        // Get the number of tracks left in the queue
        const tracksLeft = queue.tracks.length;

        const song = queue.current;

        await interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle(song.title)
                    .setDescription(`Currently playing: [${song.title}](${song.url})\n by **${song.author}**\n\n` + `\`00:00\` ` + bar + ` \`${song.duration}\`\n\n`)
                    .setThumbnail(song.thumbnail)
                    .addFields(
                        { name: `Tracks left in queue: `, value: `${tracksLeft}`, inline: true },
                        { name: `Views: `, value: `${song.views}`, inline: true }
                    )
            ],
        })
    }
};
