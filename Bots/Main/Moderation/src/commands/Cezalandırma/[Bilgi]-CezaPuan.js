const moment = require("moment");
const cezapuan = require("../../../../src/schemas/cezapuan")
const ceza = require("../../../../src/schemas/ceza")
moment.locale("tr");
const conf = require("../../../../src/configs/sunucuayar.json")
const allah = require("../../../../../../config.json");
const { red, green } = require("../../../../src/configs/emojis.json");
const messageUserChannel = require("../../../../src/schemas/messageUserChannel");
module.exports = {
  conf: {
    aliases: ["cezapuan","cp","ceza"],
    name: "cezapuan",
    help: "cezapuan <Ramal/ID>",
    category: "cezalandırma",
  },

  run: async (client, message, args, embed) => {
if (!message.member.permissions.has("BAN_MEMBERS") &&  !conf.banHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
message.react(red)
return 
}

const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if (!member) { message.channel.send({ content:"Böyle bir kullanıcı bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
message.react(red)
return 
}
const cezaData = await ceza.findOne({ guildID: allah.GuildID, userID: member.id });
const cezapuanData = await cezapuan.findOne({ userID: member.user.id });
message.react(green)
message.reply({ content:`${member} kişisinin toplamda \`${cezapuanData ? cezapuanData.cezapuan : 0}\` ceza puanı ve (Toplam **${cezaData ? cezaData.ceza.length : 0}** Ceza) olarak gözükmekte!`})
},
};

