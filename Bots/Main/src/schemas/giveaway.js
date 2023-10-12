const { Schema, model } = require("mongoose");

const schema = Schema({
    messageID: { type: String, default: "" },
    katilan: { type: Array, default: [] },
    gift: { type: String, default: "" },
    time: { type: String, default: "" },
});

module.exports = model("giveaway", schema);