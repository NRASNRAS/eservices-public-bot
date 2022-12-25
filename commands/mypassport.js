const { apiFetch, createPassportEmbed } = require("../util");

async function myPassportCommand(interaction) {
    let id = interaction.user.id;

    apiFetch("/v1/passport/lookup/discord/" + id, (res) => {
        let embed = createPassportEmbed(res);
        interaction.editReply({embeds: [embed]})
    }, (res) => {
        interaction.editReply(res)
    });
}

module.exports = {
    myPassportCommand
}