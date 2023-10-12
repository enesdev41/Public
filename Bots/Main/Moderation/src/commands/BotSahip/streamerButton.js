const { Discord, MessageButton, MessageActionRow } = require("discord.js");
const allah = require("../../../../../../config.json");
const { MessageEmbed } = require('discord.js');
const client = global.bot;

module.exports = {
  conf: {
    aliases: ["stpanel", "streamerpanel"],
    name: "streamerButton",
    help: "streamerButton",
    category: "sahip",
    owner: true,
  },

  run: async (client, message, args, embed) => {
    if (!allah.owners.includes(message.author.id)) return message.reply({ content: ":x: Bot developerı olmadığın için kurulumu yapamazsın.", ephemeral: true });

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("streamer")
          .setLabel("Streamer Al")
          .setStyle("SECONDARY")
          .setEmoji("1078707535185461259"));

    await message.channel.send({ embeds: [embed
        .setTitle(`${message.guild.name} Sunucusunun Streamer Rol Alma Sistemi`)
        .setDescription(`
        <:partner:1083402137553350746> Sizlere sunucumuzdaki **<#1082800182833451009>** odalarında yayın açmanız için yaptığımız sistemi tanıtıyoruz.

        <:kocluk:1083694887867793469> Aşağıdaki butona bastığınızda sunucumuzdaki <@&1082800045763596288> <@&1082800058120016023> rolüne sahip olan sorumlular ile bir kanal açılacaktır ve gerekileni karşılıyorsanız sizlere <@&1082800072082849932> rolü verilecetir.

        <:join:1083678483940638800> Kanalı gereksiz kullanan kişiler ceza-i işleme tabi tutulur.
        `)
], components: [row] });

  }
};

client.on('interactionCreate', async interaction => {

  const member = await client.guilds.cache.get(allah.GuildID).members.fetch(interaction.member.user.id)
  if (!member) return;

  const rowx = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("close")
        .setLabel("Kapat")
        .setStyle("SECONDARY")
        .setEmoji("1083677131285991474"),
      new MessageButton()
        .setCustomId("memberRolesAdd")
        .setLabel("Streamer Al")
        .setStyle("SECONDARY")
        .setEmoji("1083677338354585620"));
        
  const embeds = new MessageEmbed()
    .setColor('RANDOM')
    .setTitle("Ticket Oluşturuldu!")
    .setDescription(`${interaction.user} tarafından **⟡ Streamer Rooms** kategorisinde ticket oluşturuldu.
    
**Ticket Sahibi**
${interaction.member.user}
${client.emojis.cache.find(x => x.name === "yukleniyor")} \` ${interaction.member.user.id} \`

**Ticket Kategorisi**
${client.emojis.cache.find(x => x.name === "yukleniyor")} \` ⟡ Streamer Rooms \`

**İlgilenecek Roller**
${client.emojis.cache.find(x => x.name === "yukleniyor")} <@&1082800045763596288> -  <@&1082800058120016023>`)

    .setTimestamp()
    .setFooter({ text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL() });

  if (interaction.customId === "streamer") {
    await interaction.guild.channels.create(`${interaction.member.user.id}`, {
      type: "text",
      parent: "1082800182833451009",
      permissionOverwrites: [{
        id: interaction.user.id,
        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      },

      {
        id: interaction.guild.roles.cache.find(x => x.name === "Stream Coach").id,
        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      },
      {
        id: interaction.guild.roles.cache.find(x => x.name === "Stream Sorumlusu").id,
        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      },
      {
        id: client.guilds.cache.get(allah.GuildID).roles.everyone,
        deny: ['VIEW_CHANNEL'],
      },
      ],
    }).then(async c => {

      await c.send({
        content: `<@&1082800045763596288> -  <@&1082800058120016023> - ${interaction.member.user}`,
        embeds: [embeds],
        components: [rowx]
      })
      client.on("interactionCreate", async (interaction3) => {
        if (interaction3.customId == "close") {
          if(!interaction3.member.roles.cache.has("1082800045763596288") && !interaction3.member.roles.cache.has("1082800058120016023")) return interaction3.followUp({ content:`Geçersiz İşlem!`, ephemeral: true });
         const guild = client.guilds.cache.get(interaction3.guildId);
          const chan = guild.channels.cache.get(interaction3.channelId);
          await chan.delete().catch(() => { });
        }
      })
      client.on("interactionCreate", async (interaction2) => {
        const embed3 = new MessageEmbed().setAuthor({name: interaction.member.user.tag, iconURL: interaction.member.user.avatarURL()}).setColor('RANDOM').setFooter({text: "Ramal 31 çekiyo!!!"});
        if (interaction2.customId == "memberRolesAdd") {
          if(!interaction2.member.roles.cache.has("1082800045763596288") && !interaction2.member.roles.cache.has("1082800058120016023")) return interaction.followUp({ content:`Geçersiz İşlem!`, ephemeral: true });
          let member = interaction.member;
          await member.roles.add("1082800072082849932").then(async a => { 
          interaction2.reply({ content:`${member} Kullanıcısına Başarıyla **Streamer** Rolü Verildi! (10 Saniye Sonra Kanal Silincektir.)`, ephemeral: true});
          const guild = client.guilds.cache.get(interaction2.guildId);
          const chan = guild.channels.cache.get(interaction2.channelId);
          setTimeout( async() => { 
            await chan.delete().catch(() => { });
          }, 10000)
        });
        client.channels.cache.get("1083549743008972920").send({embeds:[embed3.setDescription(`
  
\`••>\` **Kullanıcı**: ${interaction.member.user}
**────────────────────────────────**
\`••>\` **Yetkili**: ${interaction2.user}
**────────────────────────────────**
\`••>\` **Tarih**: *<t:${Math.floor(Date.now()/1000)}:R>*
**────────────────────────────────**
\`••>\` **Verilen Rol**: <@&1082800072082849932>
**────────────────────────────────**
\`••>\` **Durumu**: ${client.emojis.cache.find(x => x.name === "green")} \` Başarılı \``)]});
    
};
      });
    })
  }
})

