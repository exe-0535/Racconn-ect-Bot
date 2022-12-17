const Discord = require('discord.js');
const dotenv = require('dotenv');

const { REST } = require('@discordjs/rest');
const { routes } = require('@discord-api-types/v9');
const fs = require('fs');
const { Player } = require('@discord-player');

dotenv.config();
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load";

const CLIENT_ID = "1053721800028196905";
const GUILD_ID = "906281600923340851";

const client = new Discord.Client({
    intents: [
        "GUILD",
        "GUILD_VOICE_STATES"
    ]
});

client.slashcommands = new Discord.Collection();
client.Player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});
// client.once('ready', () => console.log('Bot is online!'));

// client.on('error', console.error);
// client.on('warn', console.warn);

// client.login('DISCORD_TOKEN');