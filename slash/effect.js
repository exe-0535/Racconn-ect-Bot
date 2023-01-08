const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { AudioFilters } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sfx_on")
        .setDescription("Aktywuje wprowadzony efekt dźwiękowy na odtwarzanym utworze")
        .addStringOption((option) => option.setName("sfx").setDescription("Nazwa efektu").setRequired(true)
            .addChoices(
                { name: "8D", value: "8D" },
                { name: "BASS BOOST", value: "bassboost" },
                { name: "VAPORWAVE", value: "vaporwave" },
                { name: "PHASER", value: "phaser" },
                { name: "NIGHTCORE", value: "nightcore" },
                { name: "CHORUS", value: "chorus" }
            )
        ),

    run: async ({ client, interaction }) => {
        // EmbedBuilder
        let embed = new EmbedBuilder();

        // Check if user is on voice
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setColor(0xFFFFFF)
                        .setTitle(":raccoon: Musisz być połączony z czatem głosowym, aby użyć tej komendy")
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
                        .setTitle("Brak utworów w kolejce")
                ]
            });
        }

        // Getting the users input
        let sfx = interaction.options.getString("sfx").toLowerCase();


    }
}