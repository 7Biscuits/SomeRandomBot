const { SlashCommandBuilder } = require('discord.js');
const { fill_mask } = require('../../ai.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fill-mask')
        .setDescription('use [MASK] between a sentence for randomized output')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input sentence to fill')
                .setRequired(true)
        ),
    async execute(interaction) {
        const input = interaction.options.getString('input');
        await fill_mask({ inputs: input }).then(async (response) => {
            await interaction.reply(JSON.stringify(response));
        });
    },
}