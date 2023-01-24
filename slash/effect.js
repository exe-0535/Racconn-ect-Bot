const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { AudioFilters } = require("discord-player");
const bass = (g) => `bass=g=${g}:f=140:w=0.3`;

AudioFilters.define("subboost", "asubboost=feedback=0.4:cutoff=120");
AudioFilters.define("bassboost_low", bass(4));

// Slowed + reverb sfx

AudioFilters.define("slowed_reverb", "asetrate=48000*0.85,aresample=48000,aecho=1.0:0.9:2000:0.1")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("soundeffect_on")
        .setDescription("Activates inserted sound effect on the current queue")
        .setDescriptionLocalizations({
            pl: 'Aktywuje wprowadzony efekt dźwiękowy na aktualnej kolejce'
        })
        .addStringOption((option) => option.setName("sfx").setDescription("Effect name").setDescriptionLocalizations({
            pl: 'Nazwa efektu'
        }).setRequired(true)
            .addChoices(
                { name: "8D", value: "8D" },
                { name: "BASS BOOST", value: "bassboost" },
                { name: "VAPORWAVE", value: "vaporwave" },
                { name: "PHASER", value: "phaser" },
                { name: "NIGHTCORE", value: "nightcore" },
                { name: "CHORUS", value: "chorus" },
                { name: "SLOWED + REVERB", value: "slowed_reverb" },
                { name: "COMPRESSOR", value: "compressor" },
                { name: "DIM", value: "dim" },
                { name: "FLANGER", value: "flanger" },
                { name: "MONO", value: "mono" },
                { name: "REVERSE", value: "reverse" },
                { name: "EXPANDER", value: "expander" },
                { name: "SURROUNDING", value: "surrounding" }
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
                        .setTitle(":raccoon: You have to be connected to voice channel to use this command")
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

        // Getting the users input
        let sfx = interaction.options.getString("sfx");

        if (sfx === "8D")
            queue.setFilters({
                "8D": true
            });

        else if (sfx === "slowed_reverb") {
            queue.setFilters({
                slowed_reverb: true
            });
        }

        else if (sfx === "bassboost")
            queue.setFilters({
                bassboost_low: true,
                subboost: true
            });

        else if (sfx === "vaporwave")
            queue.setFilters({
                vaporwave: true
            });

        else if (sfx === "phaser")
            queue.setFilters({
                phaser: true
            });

        else if (sfx === "nightcore")
            queue.setFilters({
                nightcore: true
            });

        else if (sfx === "chorus")
            queue.setFilters({
                chorus: true
            });

        else if (sfx === "compressor") {
            queue.setFilters({
                compressor: true
            });
        }

        else if (sfx === "dim")
            queue.setFilters({
                dim: true
            });

        else if (sfx === "flanger")
            queue.setFilters({
                flanger: true
            });

        else if (sfx === "mono")
            queue.setFilters({
                mono: true
            });

        else if (sfx === "reverse")
            queue.setFilters({
                reverse: true
            });

        else if (sfx === "expander")
            queue.setFilters({
                expander: true
            });

        else if (sfx === "surrounding")
            queue.setFilters({
                surrounding: true
            });



        return await interaction.editReply({
            embeds: [
                embed
                    .setColor(0xFFFFFF)
                    .setTitle(`Activating effect: ${sfx.toUpperCase()}`)
            ]
        });
    }
}