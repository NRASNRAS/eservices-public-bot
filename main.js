const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require("./config.json");

const { passportCommand } = require("./commands/passport");
const { myPassportCommand } = require("./commands/mypassport");
const { lookupCommand } = require("./commands/lookup");
const { viewPassportContext } = require("./commands/viewpassportcontext");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }

        if (interaction.commandName === 'passport') {
            await interaction.deferReply();
            await passportCommand(interaction);
        }

        if (interaction.commandName === 'mypassport') {
            await interaction.deferReply();
            await myPassportCommand(interaction);
        }

        if (interaction.commandName === 'lookup') {
            await interaction.deferReply();
            await lookupCommand(interaction);
        }
    }

    if (interaction.isUserContextMenuCommand()) {
        if (interaction.commandName === 'View Passport') {
            await interaction.deferReply();
            await viewPassportContext(interaction);
        }
    }
});

client.login(token);
