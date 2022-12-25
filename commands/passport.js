const { apiFetch, createPassportEmbed } = require("../util");

async function passportCommand(interaction) {
    let id = interaction.options.getNumber('id');

    apiFetch('/v1/passport/' + id, (res) => {
        let embed = createPassportEmbed(res);
        interaction.editReply({embeds: [embed]});
    }, (res) => {
        interaction.editReply(res)
    });
}

module.exports = {
    passportCommand
}