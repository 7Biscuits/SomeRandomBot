const { SlashCommandBuilder } = require('discord.js');
const { chat } = require('../../ai.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('chat with ai bot')
        .addStringOption(option => 
            option.setName('input')
                .setDescription('input message for the bot')
                .setRequired(true)
        ),
    async execute(interaction) {
        const input = interaction.options.getString('input')
        const reply = await chat(input);
        await interaction.reply(reply);
    }
}