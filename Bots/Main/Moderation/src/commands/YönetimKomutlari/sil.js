const { MessageEmbed, Client, MessageActionRow, MessageButton } = require('discord.js');
const { green, red } = require("../../../../src/configs/emojis.json")
module.exports = {
    conf: {
      aliases: ["sil","temizle"],
      name: "sil",
      help: "sil",
      category: "yönetim",
    },
  
    run: async (client, message, args, embed) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return;
          if (args[0] && args[0] < 99 && args[0] > 0 && !isNaN(args[0])) {

            await message.delete();
            await message.channel.bulkDelete(args[0]);
            message.channel.send({ content: `<#${message.channel.id}> kanalından ${args[0]} adet mesaj silindi.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
      
      
          } else {
            const row = new MessageActionRow().addComponents(
              new MessageButton().setCustomId("on").setLabel("10").setStyle("SECONDARY"),
              new MessageButton().setCustomId("yirmibes").setLabel("25").setStyle("SECONDARY"),
              new MessageButton().setCustomId("elli").setLabel("50").setStyle("SECONDARY"),
              new MessageButton().setCustomId("yüz").setLabel("100").setStyle("SECONDARY"),
              new MessageButton().setCustomId("iptal").setLabel("X").setStyle("SECONDARY")
            );
      
            let ramalcim = new MessageEmbed()
              .setDescription(`
        \` ➥ \` **Kaç adet mesaj sileceğinizi butonlar ile seçiniz.**
        `)
              .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
      
            let msg = await message.channel.send({ embeds: [ramalcim], components: [row] })
      
            var filter = (button) => button.user.id === message.author.id;
            let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
      
            collector.on("collect", async (button) => {
      
              if (button.customId === "on") {
                await message.delete();
                await message.channel.bulkDelete(10);
                message.channel.send({ content: `${green} 10 adet mesaj silindi!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
              }
              if (button.customId === "yirmibes") {
                await message.delete();
                await message.channel.bulkDelete(25);
                message.channel.send({ content: `${green} 25 adet mesaj silindi!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
              }
              if (button.customId === "elli") {
                await message.delete();
                await message.channel.bulkDelete(50);
                message.channel.send({ content: `${green} 50 adet mesaj silindi!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
              }
              if (button.customId === "yüz") {
                await message.delete();
                await message.channel.bulkDelete(99);
                message.channel.send({ content: `${green} 100 adet mesaj silindi!` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
              }
              if (button.customId === "iptal") {
                await message.delete();
                msg.edit({ content: `${red} Mesaj silme işleminden vazgeçtiniz.`, embeds: [], components: [] }).then((e) => setTimeout(() => { e.delete(); }, 5000));
              }
            })
          }
        },
      };