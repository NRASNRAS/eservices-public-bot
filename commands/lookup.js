const { apiFetch, createPassportEmbed } = require("../util");

async function lookupCommand(interaction) {
    if (interaction.options.getSubcommand() === 'discord') {
        await lookupDiscord(interaction);
    } else if (interaction.options.getSubcommand() === 'nickname') {
        await lookupNickname(interaction);
    }
}

async function lookupDiscord(interaction) {
    const discord = interaction.options.getUser('person');

    if (!discord || !discord.id) {
        interaction.editReply({content:"Something went wrong"});
        return;
    }

    const id = discord.id;

    apiFetch("/v1/passport/lookup/" + id, (res) => {
        let embed = createPassportEmbed(res);
        interaction.editReply({embeds: [embed]})
    }, (res) => {
        interaction.editReply(res)
    });
}

async function lookupNickname(interaction) {
    const nickname = interaction.options.getString('person');

    apiFetch("/v1/passport/lookup/" + nickname, (res) => {
        let embed = createPassportEmbed(res);
        interaction.editReply({embeds: [embed]})
    }, (res) => {
        interaction.editReply(res)
    });
}

module.exports = {
    lookupCommand
}