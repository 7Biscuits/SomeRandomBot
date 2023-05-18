const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('Pong! 🏓')
			.setDescription(`💡 Latency: ${interaction.client.ws.ping}ms`)
			.setTimestamp()
			.setFooter({ text: `requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
		await interaction.reply({ embeds: [embed] });
	},
};