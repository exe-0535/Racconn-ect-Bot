const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays information about the current track in the queue"),

    run: async ({ client, interaction }) => {
        // Get the current guild's queue
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue) {
            return await interaction.editReply('There are no tracks in the queue.');
        }

        let bar = queue.createProgressBar({
            queue: false,
            length: 10,
        })

        // Get the number of tracks left in the queue
        const tracksLeft = queue.tracks.length;

        const song = queue.current;

        let embed = new EmbedBuilder();
        await interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle(song.title)
                    .setDescription(`Currently playing: [${song.title}](${song.url})\n by **${song.author}**\n\n` + bar + ` ` + `\`${song.duration}\``)
                    .setThumbnail(song.thumbnail)
                    .addFields({ name: `Tracks left in queue: `, value: `${tracksLeft}`, inline: true })
            ],
        })
    }
};
