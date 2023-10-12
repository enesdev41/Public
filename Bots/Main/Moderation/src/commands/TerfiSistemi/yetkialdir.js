const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const coin = require("../../../../src/schemas/coin");
const yetkis = require("../../../../src/schemas/yetkis");
const conf = require("../../../../src/configs/sunucuayar.json")
const allah = require("../../../../../../config.json");
const { red, green} = require("../../../../src/configs/emojis.json")
const client = global.bot;

module.exports = {
  conf: {
    aliases: ["yetki-aldır", "yetkialdır", "yetkili"],
    name: "yetki-aldır",
    help: "yetki-aldır <Ramal/ID>",
    category: "yetkili",
  },

  run: async (client, message, args, embed) => {
    
    if (!conf.staffs.some(x => message.member.roles.cache.has(x))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
    {
    message.react(red)
    message.channel.send({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!member.user.username.includes(conf.tag)) 
    {
    message.react(red)
    message.channel.send({ content:"Bu üye taglı değil!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    const yetkiData  = await yetkis.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (yetkiData  && yetkiData.yetkis.includes(member.user.id)) 
    {
    message.react(red)
    message.channel.send({ content:"Bu üyeye zaten daha önce yetki aldırılmış!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }

    const row = new MessageActionRow()
    .addComponents(
  
    new MessageButton()
    .setCustomId("onay")
    .setLabel("")
    .setStyle("SECONDARY")
    .setEmoji("1083677338354585620"),
  
    new MessageButton()
    .setCustomId("red")
    .setLabel("")
    .setStyle("SECONDARY")
    .setEmoji("1083677131285991474"),
    );
  
    const row2 = new MessageActionRow()
    .addComponents(
    new MessageButton()
    .setCustomId("onayy")
    .setLabel("")
    .setStyle("SECONDARY")
    .setEmoji("1083677338354585620")
    .setDisabled(true),
    );

    const row3 = new MessageActionRow()
    .addComponents(
    new MessageButton()
    .setCustomId("redd")
    .setLabel("")
    .setStyle("SECONDARY")
    .setEmoji("1083677131285991474")
    .setDisabled(true),
    );

    const yetkiliembed = new MessageEmbed() 
    .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
    .setFooter({ text: `60 saniye içerisinde butonlara basılmazsa işlem iptal edilecektir.`, iconURL: message.author.avatarURL({ dynamic: true })})
    .setDescription(`${member.toString()}, ${message.member.toString()} üyesi sana yetki vermek istiyor. Kabul ediyor musun?`)

    const msg = await message.reply({ content: `${member.toString()}`, embeds: [yetkiliembed], components: [row]});


var filter = button => button.user.id === member.user.id;

let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })

    collector.on("collect", async (button) => {

      if(button.customId === "onay") {
        await button.deferUpdate();
      
      const embeds = new MessageEmbed() 
      .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
      .setTimestamp()
      .setDescription(`${message.author}, ${member.toString()} Adlı kullanıcı senin yetki aldırma isteğini onayladı. ${green}`)
      
      await coin.findOneAndUpdate({ guildID: member.guild.id, userID: message.author.id }, { $inc: { coin: allah.Main.yetkiCoin } }, { upsert: true });       
      await yetkis.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { yetkis: member.user.id } }, { upsert: true });
      client.channels.cache.find(x => x.name == "yetki_log").wsend({ content:`${message.author} \`(${message.author.id})\` kişisi ${member} \`(${member.id})\` kişisini yetkiye aldı! ${green}`})
      member.roles.add(conf.yetkiRolleri)

      msg.edit({
      embeds: [embeds],
      components : [row2]
      })
      
      }
      
      if(button.customId === "red") {
        await button.deferUpdate();
      
      const embedss = new MessageEmbed() 
      .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
      .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
      .setTimestamp()
      .setDescription(`${message.author}, ${member} Adlı kullanıcı senin yetki aldırma isteğini onaylamadı. ${red}`)
      
      msg.edit({
        embeds: [embedss],
        components : [row3]
      })
          }
       });

  }
}
