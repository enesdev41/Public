const { MessageEmbed } = require("discord.js");
const conf = require("../../../../src/configs/sunucuayar.json")
const { red } = require("../../../../src/configs/emojis.json")
const emoji = require("../../../../src/configs/emojis.json")
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["say"],
    name: "say",
    help: "say",
    category: "yetkili",
  },

  run: async (client, message, args, embed) => {
    if(!conf.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
      message.react(red)
      return
    }
    let Tag = conf.tag 

    var takviye = rakam(message.guild.premiumSubscriptionCount)
    var takviyesayı = rakam(message.guild.premiumTier)
    var TotalMember = rakam(message.guild.memberCount)
    var AktifMember = rakam(message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size)
    let tag = `${rakam(message.guild.members.cache.filter(u => u.user.username.includes(Tag)).size)}`
    var sesli = rakam(message.guild.members.cache.filter((x) => x.voice.channel).size)

message.channel.send({embeds: [new MessageEmbed().setColor("RANDOM").setThumbnail(message.guild.iconURL({ dynamic: true })).setDescription(`\`•\` Şu anda toplam **${sesli}** kişi seslide.
\`•\` Sunucuda **${TotalMember}** adet üye var (**${AktifMember}** Aktif)
\`•\` Toplamda **${tag}** kişi tagımızı alarak bizi desteklemiş.
\`•\` Toplamda **${takviye}** adet boost basılmış!
`)
           ]})
 },
 };

function rakam(sayi) {
  var basamakbir = sayi.toString().replace(/ /g, "     ");
  var basamakiki = basamakbir.match(/([0-9])/g);
  basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
  if (basamakiki) {
    basamakbir = basamakbir.replace(/([0-9])/g, d => {
      return {
        '0': `0`,
        '1': `1`,
        '2': `2`,
        '3': `3`,
        '4': `4`,
        '5': `5`,
        '6': `6`,
        '7': `7`,
        '8': `8`,
        '9': `9`
      }
      [d];
    })
  }
  return basamakbir;
}