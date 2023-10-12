const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
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
const streams = require("../../../../src/schemas/StreamingJoin")
const ms = require("../../../../src/schemas/LastMeesage")
let { Stats, Seens } = require('../../../../src/schemas/Tracking');
const gorev = require("../../../../src/schemas/invite");
const kayitg = require("../../../../src/schemas/kayitgorev");
const mesaj = require("../../../../src/schemas/mesajgorev");
const tagli = require("../../../../src/schemas/taggorev");
const {  rewards, miniicon, mesaj2, staff, galp ,Muhabbet ,star , fill, empty, fillStart, emptyEnd, fillEnd, red } = require("../../../../src/configs/emojis.json");
const { TeamMember, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  conf: {
    aliases: ["ystats"],
    name: "yetkims",
    help: "yetkims",
    category: "stat",
  },

  run: async (client, message, args, embed) => {
    
    if(!conf.staffs.some(rol => message.member.roles.cache.has(rol))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!conf.staffs.some(rol => member.roles.cache.has(rol))) return message.react(red)

    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const messageDaily = messageData ? messageData.dailyStat : 0;
    const gorevData = await gorev.findOne({ guildID: message.guild.id, userID: member.user.id });
    const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });

    let st = await streams.findOne({guildId: message.guild.id, userID: member.id})
    let msj = await ms.findOne({guildId: message.guild.id, userID: member.id})
    let seens = await Seens.findOne({userID: member.user.id});

    const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: member.user.id });
    const toplamData = await toplams.findOne({ guildID: message.guild.id, userID: member.user.id });
    const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: member.user.id });
    const tagData = await tagli.findOne({ guildID: message.guild.id, userID: member.user.id });
    const tagTotal = tagData ? tagData.tagli : 0;
    const maxValue4 = "5"
    const total = gorevData ? gorevData.invite : 0;

    const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: member.user.id });
    const mesajtotal = mesajData ? mesajData.mesaj : 0;
    const maxValue3 = "10"

    const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: member.user.id });
    const kayittotal = kayitgData ? kayitgData.kayit : 0;
    const maxValue2 = "10"
const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const totals = inviterData ? inviterData.total : 0;

        const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
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
      
    var PuanDetaylari = new MessageButton()
    .setCustomId("puan_detaylari")
    .setStyle("SECONDARY")
    .setLabel("ileri")

    var GenelPuanDetaylari = new MessageButton()
    .setCustomId("ceza_puan_detaylari")
    .setStyle("SECONDARY")
    .setLabel("geri")

    var Iptal = new MessageButton()
    .setCustomId("iptal_button")
    .setStyle("SECONDARY")
    .setEmoji("1083677131285991474")

    const row = new MessageActionRow()
    .addComponents([PuanDetaylari, Iptal, GenelPuanDetaylari])

embed.setDescription(``)
.addFields(
{ name: "__**Toplam Ses**__",  value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
{ name: "__**Toplam Mesaj**__",  value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
{ name:"__**Toplam Kayıt**__",  value: `\`\`\`fix\n${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Davet**__", value: `\`\`\`fix\n${inviterData ? `${totals} regular`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Taglı**__", value: `\`\`\`fix\n${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Yetkili**__", value: `\`\`\`fix\n${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}\n\`\`\``, inline: true }
)
embed.addField(`Ses Kanalları`, `
\`• Public Odalar         :\` ${await category(conf.publicParents)}
\`• Private Odalar        :\` ${await category(conf.privateParents)}
\`• Voice Confirmed Odalar:\` ${await category(conf.registerParents)}
`, false)
embed.addField(`İlerleme Bilgileri`, `
\`• İlerleme Durumu        :\` ${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)}
\`• Üzerindeki Yetki        :\` ${message.member.roles.highest}
\`• Atlanacak Yetki   :\` ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`}


*Haftanın en iyisi ekstra puan, çeşitli ödüller ve Haftanın en iyisi rolüne sahip olup en iyilik puanını almaya hak kazanır. En iyilik puanı ise yetki yükseltiminde olumlu katkılarda bulunur!*
`, false)
embed.addField(`**Aktiflik Bilgileri**`, `
\`• Son ses aktifliği      :\` ${seens.lastSeenVoice ? `<t:${String(seens.lastSeenVoice ? seens.lastSeenVoice : Date.now()).slice(0, 10)}:R>` : "Son Seste Görülme Bulunamadı!"}
\`• Son mesaj aktifliği    :\` ${msj ? `<t:${Math.floor(msj.date / 1000)}:R>` : "Veri bulunamadı"}
\`• Son yayın aktifliği    :\` ${st ? `<t:${Math.floor(st.date / 1000)}:R>` : "Veri bulunamadı"}
   `, false)

   

    let msg = await message.channel.send({ embeds: [embed], components: [row] });

    var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 99999999 })

    collector.on("collect", async (button) => {
      if(button.customId === "puan_detaylari") {
        await button.deferUpdate();
        
const puan = new MessageEmbed()
.setDescription(``)


.addField(`**Görev Bilgileri**`, `

\`• Davet Görevi    :\` ${progressBar(gorevData ? gorevData.invite : 0, 10, 10)} (**Gereken: ${total}/10**)
\`• Kayıt Görevi    :\` ${progressBar(kayitgData ? kayitgData.kayit : 0, 10, 10)} (**Gereken: ${kayittotal}/10**)
\`• Taglı Görevi    :\` ${progressBar(tagData ? tagData.tagli : 0, 5, 5)} (**Gereken: ${tagTotal}/5**)
`, false)

msg.edit({
  embeds : [puan],
  components : [row]
})
      
      }

  if(button.customId === "ceza_puan_detaylari") {
    await button.deferUpdate();
    const ceza = new MessageEmbed()
    .setDescription(`
    ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden itibaren \`${message.guild.name}\` sunucusunda genel puanlama tablosu aşağıda belirtilmiştir.
`) 
.addField(`${star} **Ceza Kullanımı**`, `\`\`\`fix
( Ban: ${cezaData ? cezaData.BanAmount : 0} - Mute: ${cezaData ? cezaData.MuteAmount : 0} - Ses Mute: ${cezaData ? cezaData.VoiceMuteAmount : 0} - Jail: ${cezaData ? cezaData.JailAmount : 0} )\`\`\`
`)
.addField(`${star} **Ceza Puan Detayları:**`, `
${miniicon} (\` Ban işlemi \`) yerseniz, \`-100\` puan kaybedersiniz.
${miniicon} (\` Underworld \`) işlemi yerseniz, \`-75\` puan kaybedersiniz.
${miniicon} (\` Karantina/Jail \`) işlemi yerseniz, \`-50\` puan kaybedersiniz.
${miniicon} (\` Ses/Yazı \`) Mute işlemi yerseniz, \`-20\` puan kaybedersiniz.
\`\`\`fix
Toplam Aldığın Cezalar : ${cezapuanData ? cezapuanData.cezapuan.length : 0} (Toplam ${cezaData ? cezaData.ceza.length : 0})
\`\`\`
`, false)

.addField(`${star} **Puan Durumu:**`, `
Puanınız: \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken Puan: \`${maxValue.coin}\`
${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
 `, false)

.addField(`${star} **Yetki Durumu:**`, `
${coinStatus}
 `, false)

msg.edit({
  embeds: [ceza],
  components : [row]
})  
    }

      if(button.customId === "iptal_button") {
        await button.deferUpdate();
        const iptal = new MessageEmbed()
        .setDescription(``)
        .addFields(
        { name: "__**Toplam Ses**__",  value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
        { name: "__**Toplam Mesaj**__",  value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
        { name:"__**Toplam Kayıt**__",  value: `\`\`\`fix\n${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
        { name: "__**Toplam Davet**__", value: `\`\`\`fix\n${inviterData ? `${totals} regular`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
        { name: "__**Toplam Taglı**__", value: `\`\`\`fix\n${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
        { name: "__**Toplam Yetkili**__", value: `\`\`\`fix\n${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}\n\`\`\``, inline: true }
        )
        embed.addField(`Ses Kanalları`, `
        \`• Public Odalar         :\` ${await category(conf.publicParents)}
        \`• Private Odalar        :\` ${await category(conf.privateParents)}
        \`• Voice Confirmed Odalar:\` ${await category(conf.registerParents)}
        `, false)
        embed.addField(`İlerleme Bilgileri`, `
        \`• İlerleme Durumu        :\` ${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)}
        \`• Üzerindeki Yetki        :\` ${message.member.roles.highest}
        \`• Atlanacak Yetki   :\` ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`}
        
        
        *Haftanın en iyisi ekstra puan, çeşitli ödüller ve Haftanın en iyisi rolüne sahip olup en iyilik puanını almaya hak kazanır. En iyilik puanı ise yetki yükseltiminde olumlu katkılarda bulunur!*
        `, false)
        embed.addField(`**Aktiflik Bilgileri**`, `
        \`• Son ses aktifliği      :\` ${seens.lastSeenVoice ? `<t:${String(seens.lastSeenVoice ? seens.lastSeenVoice : Date.now()).slice(0, 10)}:R>` : "Son Seste Görülme Bulunamadı!"}
        \`• Son mesaj aktifliği    :\` ${msj ? `<t:${Math.floor(msj.date / 1000)}:R>` : "Veri bulunamadı"}
        \`• Son yayın aktifliği    :\` ${st ? `<t:${Math.floor(st.date / 1000)}:R>` : "Veri bulunamadı"}
           `, false)

           
   row.components[0].setDisabled(true) 
   row.components[1].setDisabled(true) 
   row.components[2].setDisabled(true)
   
    msg.edit({
      embeds: [iptal],
      components : [row]
    })
        
        }

  })
  }
};

function progressBar(value, maxValue, size) {
    const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
    const emptyProgress = size - progress > 0 ? size - progress : 0;
    if (progress === maxValue) return "Tamamlandı!";

    const progressText = fill.repeat(progress);
    const emptyProgressText = empty.repeat(emptyProgress);
    
    return emptyProgress > 0 ? fillStart+progressText+emptyProgressText+emptyEnd : fillStart+progressText+emptyProgressText+fillEnd;
    
};

