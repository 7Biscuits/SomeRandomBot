const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ask } = require('../../ai.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('get anything answered by ai!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input for the ai')
                .setRequired(true)
        ),
    async execute(interaction) {
        const prompt = interaction.options.getString('input');
        const answer = await ask(prompt);
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Question: ${prompt}`)
            .setAuthor({ name: 'Generated by openai', iconURL: 'https://cdn.iconscout.com/icon/free/png-256/free-openai-1524384-1290687.png?f=webp&w=512', url: 'https://openai.com' })
            .addFields(
                { name: 'Answer', value: answer },
            )
            .setTimestamp()
            .setFooter({ text: `requested by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
        await interaction.reply({ embeds: [embed] });
    },
};