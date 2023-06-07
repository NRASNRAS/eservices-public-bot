const { apiFetch, createPassportEmbed } = require("../util");

async function viewPassportContext(interaction) {
    let id = interaction.targetUser.id;

    apiFetch("/v1/passport/lookup/" + id, (res) => {
        let embed = createPassportEmbed(res);
        interaction.editReply({embeds: [embed]})
    }, (res) => {
        interaction.editReply(res)
    });
}

module.exports = {
    viewPassportContext
}
