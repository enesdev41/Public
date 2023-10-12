const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, IntegrationApplication, MessageActionRow, MessageButton } = require("discord.js");
const { cizgi, green, red, star } = require('../../Main/src/configs/emojis.json');
const settings = require('../data.json');
const conf = require('../../Main/src/configs/sunucuayar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cevapla")
    .setDescription("Yetkili başvurusunu cevaplamanızı sağlar.")
    .addUserOption((option) =>
          option
        .setName("user")
        .setDescription("Yetkili Başvurusunu Onaylayacağınız Kullanıcıyı Belirtiniz.")
        .setRequired(true)
    ),
  async execute(interaction, client) {

    const member = interaction.options.getMember("user");
    if(!member) {
        return interaction.reply({ content: `Belirttiğiniz üye bulunamadı.`, ephemeral: true })
      } else if(interaction.guild === null) {
        return interaction.reply({ content: `Bu komutu sadece Sunucuda **(<#${settings.BaşvuruLogChannelID}>)** kanalında kullanabilirsin!`, ephemeral: true })
      } else if(!interaction.member.roles.cache.has(conf.yetkilialımRol)) {
        return interaction.reply({ content: ":x: Yetkili Alım Rolüne Sahip olmadığın için cevaplayamazsın.", ephemeral: true })
      } else if([conf.staffs].some(role2 => member.roles.cache.get(role2))) {
        return interaction.reply({ content: ":x: Belirttiğin kullanıcı Zaten Yetkili Rolüne Sahip olduğu için başvurusunu cevaplayamazsın.", ephemeral: true })
      } else  {
    const onayla = new MessageButton()
    .setCustomId("onay")
    .setLabel("Onayla")
    .setStyle("SECONDARY")
    .setEmoji("1083677338354585620") 

    const reddet = new MessageButton()
    .setCustomId("red")
    .setLabel("Reddet")
    .setStyle("SECONDARY")
    .setEmoji("1083677131285991474") 

    var onayla2 = new MessageButton()
    .setCustomId("onay")
    .setLabel("Onaylandı")
    .setStyle("SECONDARY")
    .setEmoji("1083677338354585620") 
    .setDisabled(true);

    var reddet2 = new MessageButton()
    .setCustomId("red")
    .setLabel("Reddedildi")
    .setStyle("SECONDARY")
    .setEmoji("1083677131285991474") 
    .setDisabled(true);

    const row = new MessageActionRow()
    .addComponents([onayla, reddet])

    const onaylaa2 = new MessageActionRow()
    .addComponents([onayla2])

    const reddett2 = new MessageActionRow()
    .addComponents([reddet2])

    interaction.reply({ content: `Lütfen **20 saniye** içerisinde ${member.toString()} kullanıcısının başvurusunun akıbetini aşağıdaki butonlara tıklayarak cevaplayınız.`, components: [row] })

    var filter = (button) => button.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 20000 })

    collector.on("collect", async (interaction) => {

        if(interaction.customId === "onay") {
            await interaction.guild.members.cache.get(member.id).roles.add(conf.yetkiRolleri)

            interaction.guild.channels.cache.get(settings.BaşvuruDurumLog).send({ content: `${member.toString()}, Tebrikler! Başvurunuz **kabul edildi** ve **yetkili ekibimize** onaylandınız. ${green}\n\n${star} **Sizi onaylayan kişi :** ${interaction.user.toString()}\n\n**Önemli:** ||\`[ DM Kutunuzu açınız, size özelden ek olarak ulaşılacaktır. ]\`||\n${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}
            ` }).then(async () => interaction.update({ content: `${member.toString()} kullanıcısının başvurusu ${interaction.user.toString()} tarafınca başarıyla onaylandı.` , components: [onaylaa2] }))
            
            member.send(`Yetkili Başvurun Başarıyla **Onaylanmıştır**! ${green} Desteklerin için \`teşekkürler!\` ${green}`).catch(() => {});
        
        }

        if(interaction.customId === "red") {
          
            interaction.guild.channels.cache.get(settings.BaşvuruDurumLog).send({ content: `
            ${member.toString()}, Maalesef ! Başvurunuz **kabul edilmedi** ve **yetkili ekibimize** onaylanmadınız. ${red}\n\n${star} **Sizi onaylamayan kişi :** ${interaction.user.toString()}\n\n**Önemli:** ||\`[ DM Kutunuzu açınız, size özelden ek olarak ulaşılacaktır. ]\`||\n${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}${cizgi}
            ` }).then(async () => interaction.update({ content: `${member.toString()} kullanıcısının başvurusu ${interaction.user.toString()} tarafınca onaylanmadı.` , components: [reddett2] }))
            
            member.send(`Maalesef Yetkili Başvurun \`Reddedilmiştir!\` ${red}`).catch(() => {});

        }

    })

}
  },
};
