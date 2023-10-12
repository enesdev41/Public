const moment = require("moment");
require("moment-duration-format");
const conf = require("../../../../src/configs/sunucuayar.json");
const voiceUserParent = require("../../../../src/schemas/voiceUserParent");
const messageUser = require("../../../../src/schemas/messageUser");
const voiceUser = require("../../../../src/schemas/voiceUser");
const cezapuan = require("../../../../src/schemas/cezapuan");
const coin = require("../../../../src/schemas/coin");
const taggeds = require("../../../../src/schemas/taggeds");
const yetkis = require("../../../../src/schemas/yetkis");
const ceza = require("../../../../src/schemas/ceza");
const toplams = require("../../../../src/schemas/toplams");
const inviterSchema = require("../../../../src/schemas/inviter");
const {  rewards, miniicon, mesaj2, staff, galp ,Muhabbet ,star , fill, empty, fillStart, emptyEnd, fillEnd, red } = require("../../../../src/configs/emojis.json");
const { TeamMember, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  conf: {
    aliases: ["yetki"],
    name: "yetki",
    help: "yetki <Ramal/ID>",
    category: "yetkili",
  },

  run: async (client, message, args, embed) => {
    const ranks = [
      "1060664777396998154",
      "1060512465886121984",
      "1060351625522319360",
      "1060351622389182535",
      "1060354566572474388",
      "1061089834090897508",
      "1060351616483594351",
      "1061062812996227122",
      "1060351603829395516",
      "1060354557592473681",
      "1060351609713987715"
   
      ]

      if(!conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) 
      { 
      message.reply({ content:`Yetkin bulunmamakta dostum.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
      return }
      
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const messageDaily = messageData ? messageData.dailyStat : 0;
    
    const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });

 

    const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: member.user.id });
    const toplamData = await toplams.findOne({ guildID: message.guild.id, userID: member.user.id });
    const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: member.user.id });


const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;

        const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentId));
        let voiceStat = 0;
        for (var i = 0; i <= voiceUserParentData.length; i++) {
          voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
        }
        return moment.duration(voiceStat).format("H [saat], m [dakika]");
      };
      
      let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
      currentRank = currentRank[currentRank.length-1];

      const coinStatus = message.member.hasRole(conf.staffs, false) && client.ranks.length > 0 ?
      `${currentRank ?`
      ${currentRank !== client.ranks[client.ranks.length-1] ? `Şu an ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin-coinData.coin}\` puan daha kazanmanız gerekiyor!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz. :)"}` : ` 
      Şuan ${message.member.roles.highest} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin - (coinData ? coinData.coin : 0)}\`  Puan daha kazanmanız gerekiyor!`}` : ""
      
    var YükseltButon = new MessageButton()
    .setLabel("Yükselt")
    .setCustomId("yükselt")
    .setStyle("SECONDARY")
    .setEmoji("994977368978489385")

    var DüşürButon = new MessageButton()
    .setLabel("Düşür")
    .setCustomId("düşür")
    .setStyle("SECONDARY")
    .setEmoji("994977366902317147")

    const row = new MessageActionRow()
    .addComponents([YükseltButon, DüşürButon])

embed.setDescription(`${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden itibaren puanlama tablosu aşağıda belirtilmiştir.`) 
.setThumbnail("https://media.discordapp.net/attachments/898863704165208076/956924901971865681/qwpq.png?width=452&height=473")
.addField(`${star} **Bilgilendirme:**`, `
Aşağıda gördüğünüz puanlama tablosunda, işlenen yetki puanınız görüntülenmektedir. Puanlamaya göre sizi daha adil yetkilendirmek için puanlarınız kullanılmaktadır.
`, false)
.addField(`${star} **Puan Bilgisi:**`, `
${miniicon} Toplam Puanınız: \`${coinData ? Math.floor(coinData.coin) : 0} Puan\`
${miniicon} Seste Puanınız: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("h")*240} Puan\`
${miniicon} Yetkili Puanınız: \`${yetkiData ? yetkiData.yetkis.length*30 : 0} Puan\`
${miniicon} Taglı Puanınız: \`${taggedData ? taggedData.taggeds.length*25 : 0} Puan\`
${miniicon} Davet Puanınız: \`${total*15} Puan\`
${miniicon} Kayıt Puanınız: \`${toplamData ? toplamData.toplams.length*5.5 : 0} Puan\`
`, false)

.addField(`${star} **Net Puanlama Bilgisi**`, `
${miniicon} Seste kalarak, ortalama olarak \`+4\` puan kazanırsınız.
${miniicon} Taglı üye belirleyerek, \`+25\` puan kazanırsınız.
${miniicon} yetkili belirleyerek, \`+30\` puan kazanırsın.
${miniicon} İnsanları davet ederek, \`+15\` puan kazanırsın.
${miniicon} Kayıt işlemi yaparak, \`+5.5\` puan kazanırsın.
`, false)
.setFooter({ text:`Aşşağıdaki butonlar sayesinde yetki yükseltip düşürebilirsiniz.` })


    let msg = await message.channel.send({ embeds: [embed], components: [row] });

    var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 99999999 })

    collector.on("collect", async (button) => {

  if(button.customId === "yükselt") {
    await button.deferUpdate();
    let yetkiNumber;
    let sahipOlunanRol = Number();
    for (yetkiNumber = 0; yetkiNumber < ranks.length ; yetkiNumber++) {
      if(member.roles.cache.has(ranks[yetkiNumber])) {
        sahipOlunanRol += yetkiNumber
      };
    }  
 if(!member.roles.cache.has(ranks[ranks.length-1])){
    await member.roles.add(ranks[sahipOlunanRol+1]).catch(e => { })
    await member.roles.remove(ranks[sahipOlunanRol]).catch(e => { })

    const yk = new MessageEmbed()
    .setDescription(`${member} Kullanısı <@&${ranks[sahipOlunanRol+1]}> Yetkisine Başarılı bir Şekilde Yükseltildi.`)

    await msg.edit({ embeds: [yk], components: []}).catch(() => {})

    if (client.ranks.some(x => member.hasRole(x.role))) {
      let rank = client.ranks.filter(x => member.hasRole(x.role));
      rank = rank[rank.length-1];
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
    }

  } else { 
    button.reply({ content:`:x: Belirtilen Kullanıcı Zaten Max Role Sahip.`, ephemeral: true})}
}

      if(button.customId === "düşür") {
        await button.deferUpdate();
        let yetkiNumber;
        let sahipOlunanRol = Number();
        for (yetkiNumber = 0; yetkiNumber < ranks.length ; yetkiNumber++) {
          if(member.roles.cache.has(ranks[yetkiNumber])) {
            sahipOlunanRol += yetkiNumber
          };
        }  
        if(!member.roles.cache.has(ranks[0])){
        await member.roles.add(ranks[sahipOlunanRol-1]).catch(e => { })
        await member.roles.remove(ranks[sahipOlunanRol]).catch(e => { })

        const dşr = new MessageEmbed()
        .setDescription(`${member} Kullanısı <@&${ranks[sahipOlunanRol-1]}> Yetkisine Başarılı bir Şekilde Düşürüldü.`)
        await msg.edit({ embeds: [dşr], components: []}).catch(() => {})

        if (client.ranks.some(x => member.hasRole(x.role))) {
          let rank = client.ranks.filter(x => member.hasRole(x.role));
          rank = rank[rank.length-1];
          await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
        }
      } else {
        const sex = new MessageEmbed()
        .setDescription(`${member} adlı kullanıcısı zaten suanda başlangıç yetkisinde yetkisini almak için tepkiye tıkla.
        ${member} adlı kullanıcının Yetkisi: ${conf.yetkiRolleri.length > 1 ? conf.yetkiRolleri.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + conf.yetkiRolleri.map(x => `<@&${x}>`).slice(-1) : conf.yetkiRolleri.map(x => `<@&${x}>`).join("")}`)

        msg.edit({ embeds: [sex], components: []}).then(async msj => {
        await msj.react('✅');
      const filter = (reaction, user) => {
        return reaction.emoji.name === '✅' && user.id === message.author.id;
      };
      const collector = msj.createReactionCollector({filter, max: 1, time: 50000, error: ['time']})
      collector.on('collect', (reaction, user) => {
      member.roles.remove(conf.yetkiRolleri)
      msg.edit({ content:`${member} kullanıcısının [Yetki-Rolleri] rolleri başarılı bir şekilde alındı.`, embeds: []})
      coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: 0 } }, { upsert: true });
      });

  })
      }
}

})
}
};