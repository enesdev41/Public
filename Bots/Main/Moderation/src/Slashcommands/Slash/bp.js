const { SlashCommandBuilder } = require('@discordjs/builders');
const allah = require("../../../../../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bprofile')
        .setDescription('Bot profile editing command.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('is')
                .setDescription('Changes bot name.')
                .addStringOption(option =>
                    option.setName('veri')
                        .setDescription('The new name of the bot.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('av')
                .setDescription('Changes bot avatar.')
                .addStringOption(option =>
                    option.setName('veri')
                        .setDescription('The URL of the new avatar image.')
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        if(!allah.owners.includes(interaction.user.id)) {
            return interaction.reply({ content: ":x: Bot developerı olmadığın için kullanamazsın.", ephemeral: true })
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'is') {
            const newName = interaction.options.getString('veri');
            await interaction.client.user.setUsername(newName);
            await interaction.reply(`Bot name has been changed to ${newName}.`);
        } else if (subcommand === 'av') {
            const newAvatarUrl = interaction.options.getString('veri');
            await interaction.client.user.setAvatar(newAvatarUrl);
            await interaction.reply(`Bot avatar has been changed.`);
        }
    },
};
