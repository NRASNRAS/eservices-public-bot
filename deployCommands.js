const { token, clientid } = require("./config.json");
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Ping pong!'),
    new SlashCommandBuilder().setName('passport').setDescription('View an electronic version of a specified passport')
        .addNumberOption(option => option.setName("id").setDescription("Passport ID").setRequired(true)),
    new SlashCommandBuilder().setName('lookup').setDescription('Find someones passport')
        .addSubcommand(subcommand =>
          subcommand.setName('discord').setDescription('Lookup passport by discord')  
          .addUserOption(option => option.setName('person').setDescription('The persons discord').setRequired(true))
        )
        .addSubcommand(subcommand =>
          subcommand.setName('nickname').setDescription('Lookup passport by minecraft nickname')  
          .addStringOption(option => option.setName('person').setDescription('The persons ign').setRequired(true))
        ),
    new SlashCommandBuilder().setName('mypassport').setDescription('Display my passport'),
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientid), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();