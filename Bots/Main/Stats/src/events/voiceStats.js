const joinedAt = require("../../../src/schemas/voiceJoinedAt");
const voiceJoinedAt = require("../../../src/schemas/voiceJoinedAt");
const joinedAt2 = require("../../../src/schemas/streamerJoinedAt");
const joinedAt3 = require("../../../src/schemas/cameraJoinedAt");
const streamerUser = require("../../../src/schemas/streamerUser");
const cameraUser = require("../../../src/schemas/cameraUser");
const voiceUser = require("../../../src/schemas/voiceUser");
const voiceGuild = require("../../../src/schemas/voiceGuild");
const guildChannel = require("../../../src/schemas/voiceGuildChannel");
const userChannel = require("../../../src/schemas/voiceUserChannel");
const streamerUserChannel = require("../../../src/schemas/streamerUserChannel");
const cameraUserChannel = require("../../../src/schemas/cameraUserChannel");
const userParent = require("../../../src/schemas/voiceUserParent");
const { MessageEmbed, VoiceState } = require("discord.js");
const coin = require("../../../src/schemas/coin");
const conf = require("../../../src/configs/sunucuayar.json");
const { green, red } = require("../../../src/configs/emojis.json")
const allah = require("../../../../../config.json");
const dolar = require("../../../src/schemas/dolar") 
const client = global.bot;
const Stat = require("../../../src/schemas/level");
const s = require("../../../src/schemas/StreamingJoin")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")

/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */
module.exports = async (oldState, newState) => {
  if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
  
  if (!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
  if (!oldState.streaming && newState.streaming) await s.findOneAndUpdate({ guildId: oldState.guild.id, userID: oldState.id}, {$set: {date: Date.now()}}, {upsert:true})
  let joinedAtData = await joinedAt.findOne({ userID: oldState.id });

  if (!joinedAtData) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  joinedAtData = await joinedAt.findOne({ userID: oldState.id });
  const data = Date.now() - joinedAtData.date;

  if (oldState.channelId && !newState.channelId) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ userID: oldState.id });
  } else if (oldState.channelId && newState.channelId) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  }

if (oldState.channelId && !newState.channelId) {
    await saveDatas(oldState, oldState.channel, data);
    await voiceJoinedAt.deleteOne({ userID: oldState.id });
} else if (oldState.channelId && newState.channelId) {
    await saveDatas(oldState, oldState.channel, data);
    await voiceJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}

//////////////
if (!oldState.streaming && newState.streaming) await joinedAt2.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });

if (!oldState.streaming && newState.streaming) await joinedAt2.updateOne({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
const joinedAtData2 = (await joinedAt2.findOne({ userID: oldState.id }))
  ? await joinedAt2.findOne({ userID: oldState.id })
  : await joinedAt2.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true });

const data2 = Date.now() - joinedAtData2.date;

if (oldState.streaming && !newState.streaming) {
  await saveDatas2(oldState, oldState.channel, data2);
  await joinedAt2.deleteOne({ userID: oldState.id });
} else if (oldState.streaming && newState.streaming) {
  await saveDatas2(oldState, oldState.channel, data2);
  await joinedAt2.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}
//////////////
if (!oldState.selfVideo && newState.selfVideo) await joinedAt3.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });

if (!oldState.selfVideo && newState.selfVideo) await joinedAt3.updateOne({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
const joinedAtData3 = (await joinedAt3.findOne({ userID: oldState.id })) || await joinedAt3.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true });

const data3= Date.now() - joinedAtData3.date;

if (oldState.selfVideo && !newState.selfVideo) {
  await saveDatas3(oldState, oldState.channel, data3);
  await joinedAt3.deleteOne({ userID: oldState.id });
} else if (oldState.selfVideo && newState.selfVideo) {
  await saveDatas3(oldState, oldState.channel, data3);
  await joinedAt3.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}
//////////////
const streamChannel = client.channels.cache.find(x => x.name == "stream_log");
if (!streamChannel) return;
const cameraChannel = client.channels.cache.find(x => x.name == "camera_log");
if (!cameraChannel) return;

if (oldState.channel && !oldState.streaming && newState.channel && newState.streaming) {
const newchannelmember = newState.channel.members.map((x) => `<@${x.user.id}>`).splice(0, 20).join(", ");

streamChannel.wsend({ embeds: [new MessageEmbed().setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})}).setThumbnail(newState.member.displayAvatarURL({ dynamic: true, size: 2048 })).setColor("RANDOM")
.setDescription(`
${green} ${oldState.member} isimli kullanıcı bir sesli kanalda yayın açtı.

\` ➥ \` Ses Kanalı: <#${oldState.channel.id}>
\` ➥ \` Yayına Başlama Zamanı: <t:${Math.floor(Date.now() / 1000)}:R>

\`\`\`fix\n-Kanalında bulunan ilk 20 üye şunlardır;\n\`\`\`
${newchannelmember}`)]});
} else if (oldState.channel && oldState.streaming && newState.channel && !newState.streaming) {
const newchannelmember = newState.channel.members.map((x) => `<@${x.user.id}>`).splice(0, 20).join(", ");

streamChannel.wsend({ embeds: [new MessageEmbed().setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})}).setThumbnail(newState.member.displayAvatarURL({ dynamic: true, size: 2048 })).setColor("RANDOM")
.setDescription(`
${red} ${oldState.member} isimli kullanıcı bir sesli kanalda yayınını kapattı.
  
\` ➥ \` Ses Kanalı: <#${oldState.channel.id}>
\` ➥ \` Yayın Süresi: \` ${moment.duration(data2 ? data2 : 0).format("H [saat], m [dakika], s [saniye]")} \`
  
\`\`\`fix\n-Kanalında bulunan ilk 20 üye şunlardır;\n\`\`\`
${newchannelmember}`)]});
} else if (oldState.channel && !oldState.selfVideo && newState.channel && newState.selfVideo) {
const newchannelmember = newState.channel.members.map((x) => `<@${x.user.id}>`).splice(0, 20).join(", ");

cameraChannel.wsend({ embeds: [new MessageEmbed().setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})}).setThumbnail(newState.member.displayAvatarURL({ dynamic: true, size: 2048 })).setColor("RANDOM")
.setDescription(`
${green} ${oldState.member} isimli kullanıcı bir sesli kanalda kamera açtı.
  
\` ➥ \` Ses Kanalı: <#${oldState.channel.id}>
\` ➥ \` Kamera Açma Zamanı: <t:${Math.floor(Date.now() / 1000)}:R>
  
\`\`\`fix\n-Kanalında bulunan ilk 20 üye şunlardır;\n\`\`\`
${newchannelmember}`)]});
} else if (oldState.channel && oldState.selfVideo && newState.channel && !newState.selfVideo) {
const newchannelmember = newState.channel.members.map((x) => `<@${x.user.id}>`).splice(0, 20).join(", ");

cameraChannel.wsend({ embeds: [new MessageEmbed().setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})}).setThumbnail(newState.member.displayAvatarURL({ dynamic: true, size: 2048 })).setColor("RANDOM")
.setDescription(`
${red} ${oldState.member} isimli kullanıcı bir sesli kanalda kamerasını kapattı.
    
\` ➥ \` Ses Kanalı: <#${oldState.channel.id}>
\` ➥ \` Kamera Süresi: \` ${moment.duration(data3 ? data3 : 0).format("H [saat], m [dakika], s [saniye]")} \`
    
\`\`\`fix\n-Kanalında bulunan ilk 20 üye şunlardır;\n\`\`\`
${newchannelmember}`)]});
} 
if (oldState.channel && !newState.channel && oldState.streaming) {
const oldchannelmember = oldState.channel.members.map((x) => `<@${x.user.id}>`).splice(0, 20).join(", ");
  
streamChannel.wsend({ embeds: [new MessageEmbed().setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})}).setThumbnail(newState.member.displayAvatarURL({ dynamic: true, size: 2048 })).setColor("RANDOM")
.setDescription(`
${red} ${oldState.member} isimli kullanıcı bir sesli kanalda yayınını kapattı.
      
\` ➥ \` Ses Kanalı: <#${oldState.channel.id}>
\` ➥ \` Yayın Süresi: \` ${moment.duration(data2 ? data2 : 0).format("H [saat], m [dakika], s [saniye]")} \`
      
\`\`\`fix\n-Kanalında bulunan ilk 20 üye şunlardır;\n\`\`\`
${oldchannelmember}`)]});
}
if (oldState.channel && !newState.channel && oldState.selfVideo) {
const oldchannelmember = oldState.channel.members.map((x) => `<@${x.user.id}>`).splice(0, 20).join(", ");

cameraChannel.wsend({ embeds: [new MessageEmbed().setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})}).setThumbnail(newState.member.displayAvatarURL({ dynamic: true, size: 2048 })).setColor("RANDOM")
.setDescription(`
${red} ${oldState.member} isimli kullanıcı bir sesli kanalda kamerasını kapattı.
      
\` ➥ \` Ses Kanalı: <#${oldState.channel.id}>
\` ➥ \` Kamera Süresi: \` ${moment.duration(data3 ? data3 : 0).format("H [saat], m [dakika], s [saniye]")} \`
      
\`\`\`fix\n-Kanalında bulunan ilk 20 üye şunlardır;\n\`\`\`
${oldchannelmember}`)]});
}
//////////////
};

async function saveData(user, channel, data) {
  await voiceUser.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await voiceGuild.findOneAndUpdate({ guildID: allah.GuildID }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: allah.GuildID, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  if (channel.parent) await userParent.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id, parentID: channel.parentId }, { $inc: { parentData: data } }, { upsert: true });

  if (channel.parent && conf.publicParents.includes(channel.parentId)) {
    if (data >= (1000 * 60) * allah.Main.voiceCount) await dolar.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id }, { $inc: { dolar: allah.Main.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });
  } else if (data >= (1000 * 60) * allah.Main.voiceCount) await dolar.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id }, { $inc: { dolar: allah.Main.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });
}

async function saveDatas(user, channel, data) {
  if (conf.staffs.some(x => user.member.roles.cache.has(x))) {
    if (channel.parent && conf.publicParents.includes(channel.parentId)) {
      if (data >= (1000 * 60) * allah.Main.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / allah.Main.voiceCount) * allah.publicCoin } }, { upsert: true });
    } else if (data >= (1000 * 60) * allah.Main.voiceCount) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / allah.Main.voiceCount) * allah.voiceCoin } }, { upsert: true });
    const coinData = await coin.findOne({ guildID: user.guild.id, userID: user.id });
    if (coinData && client.ranks.some((x) => x.coin >= coinData.coin)) {
      let newRank = client.ranks.filter((x) => coinData.coin >= x.coin);
      newRank = newRank[newRank.length-1];
      if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role)) {
        user.member.roles.add(newRank.role);
        const oldRoles = client.ranks.filter((x) => coinData.coin < x.coin && user.member.hasRole(x.role));
        oldRoles.forEach((x) => x.role.forEach((r) => user.member.roles.remove(r)));
      }
    }
  }
}

async function saveDatas2(user, channel, data2) {
  await streamerUser.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id }, { $inc: { topStat: data2  } }, { upsert: true });
  await streamerUserChannel.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id, channelID: channel.id }, { $inc: { channelData: data2 } }, { upsert: true });
}
async function saveDatas3(user, channel, data3) {
  await cameraUser.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id }, { $inc: { topStat: data3 } }, { upsert: true });
  await cameraUserChannel.findOneAndUpdate({ guildID: allah.GuildID, userID: user.id, channelID: channel.id }, { $inc: { channelData: data3 } }, { upsert: true });
} 

async function levelVoiceXP(id, channel, value, xp, category) {
let randomVoiceXP = ((Math.random() * 0.008) + 0.001).toFixed(3);
await Stat.findOneAndUpdate({ guildID: allah.GuildID, userID: id }, { $inc: { voiceXP: xp * randomVoiceXP } }, { upsert: true });
const data = await Stat.findOne({ guildID: allah.GuildID, userID: id });
let siradakilevel = data.voiceLevel * 643;
if (siradakilevel <= data.voiceXP) { 
await Stat.findOneAndUpdate({ guildID: allah.GuildID, userID: id }, { $inc: {["voiceLevel"]: 1 }}, { upsert: true });
}
};

module.exports.conf = {
  name: "voiceStateUpdate",
};