const { EmbedBuilder, Colors } = require('discord.js');
const { apiurl } = require("./config.json");

function apiFetch(url, callback, callbackString) {
    fetch(apiurl + url)
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

function createPassportEmbed(res) {
    return new EmbedBuilder()
        .setTitle(res.country + " Passport")
        .setColor(res.isvalid ? Colors.Green : Colors.Red)
        .setFooter({text: (res.isvalid ? "Valid" : "Invalid") + " | " + res.platform})
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

module.exports = {
    apiFetch,
    createPassportEmbed
};
