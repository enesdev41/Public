const conf = require("../../../src/configs/sunucuayar.json");
const allah = require("../../../../../config.json");
const messageUser = require("../../../src/schemas/messageUser");
const messageGuild = require("../../../src/schemas/messageGuild");
const guildChannel = require("../../../src/schemas/messageGuildChannel");
const userChannel = require("../../../src/schemas/messageUserChannel");
const coin = require("../../../src/schemas/coin");
const client = global.bot;
const nums = new Map();
const mesaj = require("../../../src/schemas/mesajgorev");
const dolar = require("../../../src/schemas/dolar")
const ms = require("../../../src/schemas/LastMeesage")

module.exports = async (message) => {
  if (message.author.bot || !message.guild || message.content.startsWith(allah.Main.prefix)) return;
  
  if (conf.staffs.some(x => message.member.roles.cache.has(x))) {
    const num = nums.get(message.author.id);
    if (num && (num % allah.Main.messageCount) === 0) {
      nums.set(message.author.id, num + 1);
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: allah.Main.messageCoin } }, { upsert: true });
      const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (coinData && client.ranks.some((x) => coinData.coin >= x.coin)) {
        let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
        newRank = newRank[newRank.length-1];
        if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => message.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !message.member.roles.cache.has(newRank.role)) {
        message.member.roles.add(newRank.role);
        const oldRoles = client.ranks.filter((x) => newRank.coin > x.coin);
        oldRoles.forEach((x) => x.role.forEach((r) => message.member.roles.cache.has(r) && message.member.roles.remove(r)));
    }
  }
    } else nums.set(message.author.id, num ? num + 1 : 1);
  }

  await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await ms.findOneAndUpdate({guildId: message.guild.id, userID: message.author.id}, {$set: {date: Date.now()}}, {upsert:true})
  let seen = await Seens.findOne({ guildId: message.guild.id, User: message.author.id })
  if(dolar) {
  if(message.channel.id !== conf.chatChannel) return;
  await dolar.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { dolar: allah.messageDolar } }, { upsert: true });
  }
const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: message.author.id });
if(mesajData){
if(message.channel.id !== conf.chatChannel) return;
await mesaj.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { mesaj: 1 } }, { upsert: true });
}
};

module.exports.conf = {
  name: "messageCreate",
};
