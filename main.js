const { Client, GatewayIntentBits, EmbedBuilder, Colors } = require('discord.js');
const { token, apiurl } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });

function apiFetch(url, callback, callbackString) {
    fetch(url)
    .then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return res.text();
        }
    })
    .then((res) => {
        if (typeof res === "string") {
            callbackString(res);
        } else {
            callback(res);
        }
    })
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

function createPassportEmbed(res) {
    return new EmbedBuilder()
        .setTitle(res.country + " Passport")
        .setColor(res.isvalid ? Colors.Green : Colors.Red)
        .setFooter({text: res.isvalid ? "Valid" : "Invalid"})
        .addFields(
            {name: "ID", value: res.id+""},
            {name: "Name", value: res.username},
            {name: "Discord", value: res.discord ? `<@${res.discord}>` : "None"},
            {name: "Place", value: res.place || "Unknown"},
            {name: "Expires", value: res.expires.split("T")[0]},
            {name: "Issued on", value: res.issuedon.split("T")[0]},
            {name: "Issued by", value: `<@${res.issuedby}>`}
        )
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'passport') {
        let id = interaction.options.getNumber('id');
        apiFetch(apiurl+ '/v1/passport/' + id, (res) => {
            let embed = createPassportEmbed(res);
            interaction.reply({embeds: [embed]});
        }, (res) => interaction.reply(res));
    }

    if (interaction.commandName === 'mypassport') {
        let id = interaction.user.id;
        apiFetch(apiurl + "/v1/passport/lookup/discord/" + id, (res) => {
            let embed = createPassportEmbed(res);
            interaction.reply({embeds: [embed]})
        }, (res) => interaction.reply(res));
    }

    if (interaction.commandName === 'lookup') {
        if (interaction.options.getSubcommand() === 'discord') {
            const discord = interaction.options.getUser('person');
            if (!discord || !discord.id) {
                interaction.reply({content:"Something went wrong"});
                return;
            }

            const id = discord.id;
            apiFetch(apiurl + "/v1/passport/lookup/discord/" + id, (res) => {
                let embed = createPassportEmbed(res);
                interaction.reply({embeds: [embed]})
            }, (res) => interaction.reply(res));
        } else if (interaction.options.getSubcommand() === 'nickname') {
            const nickname = interaction.options.getString('person');
            apiFetch(apiurl + "/v1/passport/lookup/nickname/" + nickname, (res) => {
                let embed = createPassportEmbed(res);
                interaction.reply({embeds: [embed]})
            }, (res) => interaction.reply(res));
        }
    }
});

client.login(token);