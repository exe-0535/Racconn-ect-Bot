const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { AudioFilters } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("effect")
        .setDescription("Aktywuje wprowadzony efekt dźwiękowy na odtwarzanym pliku")
        .addStringOption((option) => option.setName("sfx").setDescription("Nazwa efektu").setRequired(true)),

    run: async ({ client, interaction }) => {

    }
}