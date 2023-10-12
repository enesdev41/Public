const { MessageAttachment, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const conf = require("../../../../src/configs/sunucuayar.json")
const { voice, mesaj2, star, miniicon, kirmiziok } = require("../../../../src/configs/emojis.json");
const messageUserChannel = require("../../../../src/schemas/messageUserChannel");
const voiceUserChannel = require("../../../../src/schemas/voiceUserChannel");
const streamerUserChannel = require("../../../../src/schemas/streamerUserChannel");
const cameraUserChannel = require("../../../../src/schemas/cameraUserChannel");
const messageUser = require("../../../../src/schemas/messageUser");
const voiceUser = require("../../../../src/schemas/voiceUser");
const voiceUserParent = require("../../../../src/schemas/voiceUserParent");
const isimler = require("../../../../src/schemas/names");
const register = require("../../../../src/schemas/registerStats");
const inviterSchema = require("../../../../src/schemas/inviter");
const inviterMember = require("../../../../src/schemas/inviteMember");
const streamerUser = require("../../../../src/schemas/streamerUser");
const cameraUser = require("../../../../src/schemas/cameraUser");
const allah = require("../../../../../../config.json");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const wait = require('node:timers/promises').setTimeout;
const Canvas = require("canvas");

module.exports = {
  conf: {
    aliases: ["me", "stat"],
    name: "stat",
    help: "stat",
    category: "stat",
  },

  run: async (client, message, args, prefix) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;
    const invMember = await inviterMember.find({ guildID: message.guild.id, inviter: member.user.id });
    const daily = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
    const weekly = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
    let tagged;
    if (conf.tag && conf.tag.length > 0) tagged = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && m.user.username.includes(conf.tag)).size : 0;
    else tagged = 0;

    const category = async (parentsArray) => {
      const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
      const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
      let voiceStat = 0;
      for (var i = 0; i <= voiceUserParentData.length; i++) {
        voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
      }
      return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
    };

    const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
    const Active3 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
    const Active4 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
    const Active5 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });

    let messageTop2;
    Active3.length > 0 ? messageTop2 = Active3.splice(0, 3).map(x => client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID) ? `#${client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID).name}` : `Kanal Bulunamadı`).join("\n\n\n") : messageTop2 = ""

    let messageTop3;
    Active4.length > 0 ? messageTop3 = Active4.splice(0, 3).map(x => `${Number(x.channelData).toLocaleString()} mesaj`).join("\n\n\n") : messageTop3 = ""

    let voiceTop;
    Active2.length > 0 ? voiceTop = Active2.splice(0, 3).map(x => client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID) ? client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID).name : `Kanal Bulunamadı`).join("\n\n\n") : voiceTop = ""

    let voiceTop2;
    Active5.length > 0 ? voiceTop2 = Active5.splice(0, 3).map(x => `${moment.duration(x.channelData).format("H [sa], m [dk]")}`).join("\n\n\n") : voiceTop2 = ""
    /////////////

    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
    const messageDaily = messageData ? messageData.dailyStat : 0;
    const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");

    if (member.user.bot) return;

    const yayındata = await streamerUser.findOne({ guildID: message.guild.id, userID: member.id });
    const kameradata = await cameraUser.findOne({ guildID: message.guild.id, userID: member.id });

    const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
    const rolleri = []
    if (roles.length > 6) {
      const lent = roles.length - 6
      let itemler = roles.slice(0, 6)
      itemler.map(x => rolleri.push(x))
      rolleri.push(`${lent} daha...`)
    } else {
      roles.map(x => rolleri.push(x))
    }
    const members = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
    const joinPos = members.map((u) => u.id).indexOf(member.id);
    const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
    const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
    const bilgi = `${previous ? `**${previous.tag}** > ` : ""}<@${member.id}>${next ? ` > **${next.tag}**` : ""}`
    let üye = message.guild.members.cache.get(member.id)
    let nickname = üye.displayName == member.username ? "" + member.username + " [Yok] " : member.displayName

    const yazı = []
    if (member.user.username.length > 15) {
      let yarrak = member.user.username.slice(0, 15)
      yazı.push(`${yarrak}...`)
    } else {
      yazı.push(`${member.user.tag}`)
    }

    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('top')
          .setPlaceholder(`${yazı}'n detaylarını görüntüle`)
          .addOptions([
            { label: 'Ses İstatistik Detay', description: 'Ses istatistiklerinin detaylı bilgilerini görüntülemektedir', value: 'stat1', emoji: `🎤` },
            { label: 'Mesaj İstatistik Detay', description: 'Mesaj istatistiklerinin detaylı bilgilerini görüntülemektedir', value: 'stat2', emoji: `✉️` },
            { label: 'Yayın Detay', description: 'Yayın istatistiklerinin detaylı bilgilerini görüntülemektedir', value: 'stat3', emoji: `🎬` },
            { label: 'Kamera Detay', description: 'Kamera istatistiklerinin detaylı bilgilerini görüntülemektedir', value: 'stat4', emoji: `📸` },
            { label: 'İnvite Detay', description: `${message.guild.name} sunucusundaki detaylı davet bilgileriniz.`, value: 'stat5', emoji: `📩` },
            { label: `İşlem İptal`, value: 'stat6', emoji: { id: "909485171240218634" } },
          ]),
      );

    const applyText = (canvas, text) => {
      const ctx = canvas.getContext('2d');

      let fontSize = 70;

      do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
      } while (ctx.measureText(text).width > canvas.width - 300);

      return ctx.font;
    };
    const canvas = Canvas.createCanvas(930, 295);
    const ctx = canvas.getContext('2d');

    let background = await Canvas.loadImage("https://cdn.discordapp.com/attachments/1009804086293565501/1097066933708398662/ramalstatss.png");
    ctx.save();
    roundedImage(ctx, 0, 0, 930, 295, 20);
    ctx.clip();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.closePath();

    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);


    const yazı2 = []
    if (member.user.username.length > 8) {
      let yarrak = member.user.username.slice(0, 8)
      yazı2.push(`${yarrak}...`)
    } else {
      yazı2.push(`${member.user.username}`)
    }

    ctx.font = '28px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${yazı}`, canvas.width / 7.9, canvas.height / 4.5);

    ctx.font = '22px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${moment(member.user.createdAt).format("LL")}`, canvas.width / 1.67, canvas.height / 4.1);

    ctx.font = '22px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${moment(member.joinedAt).format("LL")}`, canvas.width / 1.24, canvas.height / 4.1);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#ffffff';
    ctx.fillText(`Ses Süresi`, canvas.width / 11.1, canvas.height / 1.94);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#ffffff';
    ctx.fillText(`Mesaj Sayısı`, canvas.width / 12.1, canvas.height / 1.57);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#ffffff';
    ctx.fillText(`Yayın Süresi`, canvas.width / 12.1, canvas.height / 1.32);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#ffffff';
    ctx.fillText(`Kamera Süresi`, canvas.width / 12.3, canvas.height / 1.13);
    ///
    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [sa], m [dk]")}`, canvas.width / 4.7, canvas.height / 1.94);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${messageData ? messageData.topStat : 0} mesaj`, canvas.width / 4.7, canvas.height / 1.57);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${moment.duration(yayındata ? yayındata.topStat : 0).format("H [sa], m [dk]")}`, canvas.width / 4.7, canvas.height / 1.32);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${moment.duration(kameradata ? kameradata.topStat : 0).format("H [sa], m [dk]")}`, canvas.width / 4.7, canvas.height / 1.13);
    ////
    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#ffffff';
    ctx.fillText(`${messageTop2}`, canvas.width / 2.7, canvas.height / 1.84);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${messageTop3}`, canvas.width / 1.9, canvas.height / 1.84);
    ////
    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#ffffff';
    ctx.fillText(`${voiceTop}`, canvas.width / 1.4, canvas.height / 1.84);

    ctx.font = '12px "Marlin Geo Black"',
      ctx.fillStyle = '#020202';
    ctx.fillText(`${voiceTop2}`, canvas.width / 1.15, canvas.height / 1.84);
    ////////////////bitiş////////////////////////////////////////////////  
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
    ctx.save();
    roundedImage(ctx, 15, 19, 70, 70, 15);
    ctx.clip();
    ctx.drawImage(avatar, 15, 19, 70, 70);
    ctx.closePath();

    // Clip off the region you drew on
    ctx.clip();

    function roundedImage(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    const attachment = new MessageAttachment(canvas.toBuffer(), 'ozi.png');

    ////////////////
    let msg = await message.channel.send({ files: [attachment], components: [row] })

    var filter = (xd) => xd.user.id === message.author.id;
    let collector = msg.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 99999999 })

    collector.on("collect", async (interaction) => {

      if (interaction.values[0] === "stat1") {
        await interaction.deferUpdate();
        const row2 = new MessageActionRow()
          .addComponents(
            new MessageButton().setCustomId("önce").setLabel("").setStyle("SECONDARY").setEmoji("1083677034993168435"),
            new MessageButton().setCustomId("kapat").setLabel("").setStyle("SECONDARY").setEmoji("1083677131285991474"),
            new MessageButton().setCustomId("sonra").setLabel("").setStyle("SECONDARY").setEmoji("1083677255848435784"),
          );

        const Active8 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });

        if (Active8.length < 0) return;
        let page = 1;
        let liste = Active8.map((x, index) => `\` ${index + 1} \` ${client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID) ? client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID).name : `Kanal Bulunamadı`}: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``)

        const embeds = new MessageEmbed()
          .setDescription(`Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`ses\` ) sıralaması listelenmektedir.`)
          .addFields(
            { name: "__**Toplam Ses**__", value: `\`\`\`cs\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
            { name: "__**Haftalık Ses**__", value: `\`\`\`cs\n${voiceWeekly}\n\`\`\``, inline: true },
            { name: "__**Günlük Ses**__", value: `\`\`\`cs\n${voiceDaily}\n\`\`\``, inline: true },
          )
        if (liste.length > 0) {
          embeds.addField(`${star} **Sesli Kanal İstatistiği**`, `
${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}
`, false)
        }
        embeds.addField(`${star} **Sesli Kategori İstatistiği**`, `
${miniicon} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
${miniicon} Public Odalar: \` ${await category(conf.publicParents)} \`
${miniicon} Secret Odalar: \` ${await category(conf.privateParents)} \`
${miniicon} Alone Odalar: \` ${await category(conf.aloneParents)} \`
${miniicon} Yönetim Yetkili Odaları: \` ${await category(conf.funParents)} \`
${miniicon} Kayıt Odaları: \` ${await category(conf.registerParents)} \`

Genel sohbet( \`ses\` ) sıralaması \`${moment(Date.now()).format("LLL")}\` tarihinde otomatik olarak güncellenmiştir.
`, false)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
        msg.edit({ embeds: [embeds], components: [row, row2], files: [] })

        if (msg) {
          var filter = (button) => button.user.id === message.author.id;
          let collector2 = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 99999999 })

          collector2.on("collect", async (button) => {

            if (button.customId === "önce") {
              await button.deferUpdate();

              if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
              page -= 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`ses\` ) sıralaması listelenmektedir.\n\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "sonra") {
              await button.deferUpdate();

              if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
              page += 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`ses\` ) sıralaması listelenmektedir.\n\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "kapat") {
              await button.deferUpdate();
              if (msg) msg.delete();
            }
          })
        }
      }

      if (interaction.values[0] === "stat2") {
        await interaction.deferUpdate();
        const row2 = new MessageActionRow()
          .addComponents(
            new MessageButton().setCustomId("önce2").setLabel("").setStyle("SECONDARY").setEmoji("1083677034993168435"),
            new MessageButton().setCustomId("kapat2").setLabel("").setStyle("SECONDARY").setEmoji("1083677131285991474"),
            new MessageButton().setCustomId("sonra2").setLabel("").setStyle("SECONDARY").setEmoji("1083677255848435784"),
          );

        const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });

        if (Active1.length < 0) return;
        let page = 1;
        let liste = Active1.map((x, index) => `\` ${index + 1} \` <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``)

        const embeds = new MessageEmbed()
          .setDescription(`🎉 Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`mesaj\` ) sıralaması listelenmektedir.`)
          .addFields(
            { name: "__**Toplam Mesaj**__", value: `\`\`\`cs\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
            { name: "__**Haftalık Mesaj**__", value: `\`\`\`cs\n${Number(messageWeekly).toLocaleString()} mesaj\n\`\`\``, inline: true },
            { name: "__**Günlük Mesaj**__", value: `\`\`\`cs\n${Number(messageDaily).toLocaleString()} mesaj\n\`\`\``, inline: true },
          )
          .addField(`${star} **Mesaj İstatistiği**`, `
${Active1.length ? `${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}` : 'Mesaj bilgisi bulunmamaktadır.'}

Genel sohbet( \`mesaj\` ) sıralaması \`${moment(Date.now()).format("LLL")}\` tarihinde otomatik olarak güncellenmiştir.
`, false)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
        msg.edit({ embeds: [embeds], components: [row, row2], files: [] })

        if (msg) {
          var filter = (button) => button.user.id === message.author.id;
          let collector2 = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 99999999 })

          collector2.on("collect", async (button) => {

            if (button.customId === "önce2") {
              await button.deferUpdate();

              if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
              page -= 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`ses\` ) sıralaması listelenmektedir.\n\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "sonra2") {
              await button.deferUpdate();

              if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
              page += 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`ses\` ) sıralaması listelenmektedir.\n\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "kapat2") {
              await button.deferUpdate();
              if (msg) msg.delete();
            }
          })
        }
      }

      if (interaction.values[0] === "stat3") {
        await interaction.deferUpdate();
        const row2 = new MessageActionRow()
          .addComponents(
            new MessageButton().setCustomId("önce3").setLabel("").setStyle("SECONDARY").setEmoji("1083677034993168435"),
            new MessageButton().setCustomId("kapat3").setLabel("").setStyle("SECONDARY").setEmoji("1083677131285991474"),
            new MessageButton().setCustomId("sonra3").setLabel("").setStyle("SECONDARY").setEmoji("1083677255848435784"),
          );

        const Active6 = await streamerUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });

        if (Active6.length < 0) return;
        let page = 1;
        let liste = Active6.map((x, index) => `\` ${index + 1} \` ${client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID) ? client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID).name : `Kanal Bulunamadı`}: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``)

        const embeds = new MessageEmbed()
          .setDescription(`Aşağıda ${member} kullanıcısının detaylı **Yayın** bilgileri görüntülenmektedir. 

**❯ Detaylı Yayın Bilgisi**
${Active6.length ? `${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}` : 'Yayın bilgisi bulunmamaktadır.'}
`)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        msg.edit({ embeds: [embeds], components: [row, row2], files: [] })

        if (msg) {
          var filter = (button) => button.user.id === message.author.id;
          let collector2 = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 99999999 })

          collector2.on("collect", async (button) => {

            if (button.customId === "önce3") {
              await button.deferUpdate();

              if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
              page -= 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda ${member} kullanıcısının detaylı **Yayın** bilgileri görüntülenmektedir.\n\n**❯ Detaylı Yayın Bilgisi**\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "sonra3") {
              await button.deferUpdate();

              if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
              page += 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda ${member} kullanıcısının detaylı **Yayın** bilgileri görüntülenmektedir.\n\n**❯ Detaylı Yayın Bilgisi**\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "kapat3") {
              await button.deferUpdate();
              if (msg) msg.delete();
            }
          })
        }
      }
      if (interaction.values[0] === "stat4") {
        await interaction.deferUpdate();
        const row2 = new MessageActionRow()
          .addComponents(
            new MessageButton().setCustomId("önce4").setLabel("").setStyle("SECONDARY").setEmoji("1083677034993168435"),
            new MessageButton().setCustomId("kapat4").setLabel("").setStyle("SECONDARY").setEmoji("1083677131285991474"),
            new MessageButton().setCustomId("sonra4").setLabel("").setStyle("SECONDARY").setEmoji("1083677255848435784"),
          );

        const Active7 = await cameraUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });

        if (Active7.length < 0) return;
        let page = 1;
        let liste = Active7.map((x, index) => `\` ${index + 1} \` ${client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID) ? client.guilds.cache.get(allah.GuildID).channels.cache.get(x.channelID).name : `Kanal Bulunamadı`}: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``)

        const embeds = new MessageEmbed()
          .setDescription(`Aşağıda ${member} kullanıcısının detaylı **Kamera** bilgileri görüntülenmektedir.

**❯ Detaylı Kamera Bilgisi**
${Active7.length ? `${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}` : 'Kamera bilgisi bulunmamaktadır.'}
`)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        msg.edit({ embeds: [embeds], components: [row, row2], files: [] })

        if (msg) {
          var filter = (button) => button.user.id === message.author.id;
          let collector2 = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 99999999 })

          collector2.on("collect", async (button) => {

            if (button.customId === "önce4") {
              await button.deferUpdate();

              if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
              page -= 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda ${member} kullanıcısının detaylı **Kamera** bilgileri görüntülenmektedir.\n\n**❯ Detaylı Kamera Bilgisi**\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "sonra4") {
              await button.deferUpdate();

              if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
              page += 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda ${member} kullanıcısının detaylı **Kamera** bilgileri görüntülenmektedir.\n\n**❯ Detaylı Kamera Bilgisi**\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "kapat4") {
              await button.deferUpdate();
              if (msg) msg.delete();
            }
          })
        }
      }

      if (interaction.values[0] === "stat5") {
        await interaction.deferUpdate();
        const row2 = new MessageActionRow()
          .addComponents(
            new MessageButton().setCustomId("önce5").setLabel("").setStyle("SECONDARY").setEmoji("1083677034993168435"),
            new MessageButton().setCustomId("kapat5").setLabel("").setStyle("SECONDARY").setEmoji("1083677131285991474"),
            new MessageButton().setCustomId("sonra5").setLabel("").setStyle("SECONDARY").setEmoji("1083677255848435784"),
          );

        const invMember2 = await inviterMember.find({ inviter: member.id });
        const davet = invMember2 ? invMember2.filter(value => message.guild.members.cache.get(value.userID)).map((value, index) => `${message.guild.members.cache.get(value.userID)} - \` ${value.userID} \``).join("\n") : undefined

        if (invMember2.length < 0) return;
        let page = 1;
        let liste = invMember2.map((value, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(value.userID)} - \` ${value.userID} \``)

        const embeds = new MessageEmbed()
          .setDescription(`Aşağıda ${member} kullanıcısının detaylı **İnvite** bilgileri görüntülenmektedir.

**❯ Detaylı Davet Bilgisi:** (Toplam **${total}** davet.)
${star} \`[ ${regular} gerçek, ${bonus} ekstra, ${leave} ayrılmış, ${fake} sahte ]\`
      
${kirmiziok} Günlük: \` ${daily} \`, Haftalık: \` ${weekly} \`, Taglı: \` ${tagged} \`

${davet ? `**❯ Davet ettiği tüm kişiler;**\n${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}` : 'Davet ettiği üye bulunmamaktadır.'}`)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        msg.edit({ embeds: [embeds], components: [row, row2], files: [] })

        if (msg) {
          var filter = (button) => button.user.id === message.author.id;
          let collector2 = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 99999999 })

          collector2.on("collect", async (button) => {

            if (button.customId === "önce5") {
              await button.deferUpdate();

              if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
              page -= 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda ${member} kullanıcısının detaylı **İnvite** bilgileri görüntülenmektedir.\n\n**❯ Davet ettiği tüm kişiler;**\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "sonra5") {
              await button.deferUpdate();

              if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
              page += 1;
              let Veri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({ embeds: [new MessageEmbed().setDescription(`Aşağıda ${member} kullanıcısının detaylı **İnvite** bilgileri görüntülenmektedir.\n\n**❯ Davet ettiği tüm kişiler;**\n${Veri}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))] });
            }

            if (button.customId === "kapat5") {
              await button.deferUpdate();
              if (msg) msg.delete();
            }
          })
        }
      }
      if (interaction.values[0] === "stat6") {
        await interaction.deferUpdate();
        if (msg) msg.delete();
      }

    })
  },
};

