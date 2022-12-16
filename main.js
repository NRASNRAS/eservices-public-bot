const { Client, GatewayIntentBits, EmbedBuilder, Colors } = require('discord.js');
const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'passport') {
    let id = interaction.options.getNumber('id');
    fetch('http://localhost/v1/passport/' + id)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return res.text();
            }
        })
        .then((res) => {
            if (typeof res === "string") {
                interaction.reply({content: res});
                return;
            } else {
                let embed = new EmbedBuilder()
                    .setTitle(res.country + " Passport")
                    .setColor(res.isvalid ? Colors.Green : Colors.Red)
                    .setFooter({text: res.isvalid ? "Valid" : "Invalid"})
                    .addFields(
                        {name: "ID", value: res.id+""},
                        {name: "Name", value: res.username},
                        {name: "Discord", value: `<@${res.discord}>`},
                        {name: "Expires", value: res.expires.split("T")[0]},
                        {name: "Issued on", value: res.issuedon.split("T")[0]},
                        {name: "Issued by", value: `<@${res.issuedbyperson}> @ ${res.issuedby}`}
                    )
                interaction.reply({embeds: [embed]})
            }
        })
  }
});

client.login(token);