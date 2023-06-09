const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generate_image } = require('../../ai.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate-image')
        .setDescription('Generates an image based on your input')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input to generate the image')
                .setRequired(true)
        ),
    async execute(interaction) {
        const prompt = interaction.options.getString('input');
        await interaction.deferReply();
        const image = await generate_image(prompt);
        const embed = new EmbedBuilder()
            .setTitle(prompt)
            .setAuthor({ name: 'Generated by openai', iconURL: 'https://cdn.iconscout.com/icon/free/png-256/free-openai-1524384-1290687.png?f=webp&w=512', url: 'https://openai.com' })
            .setImage(image)
            .setTimestamp()
            .setFooter({ text: `requested by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() });
        await interaction.editReply({ embeds: [embed] });
    },
}