const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { chat, chat_openai } = require('./ai.js')
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent
	]
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

// client.on('messageCreate', async (message) => {
// 	try {
// 		if (message.author.bot) return;

// 		const reply = await chat(message.content);
// 		await message.reply(reply);
// 	} catch (err) {
// 		await message.reply(err.message);
// 	}
// });

// client.on("messageCreate", async function (message) {
// 	if (message.author.bot) return;

// 	// if (message.channel.id !== '1108810494749446154') return;

// 	try {
// 		const reply = await chat_openai(message.content);
// 		await message.reply(reply);
// 	} catch (err) {
// 		console.error(err);
// 		await message.reply(
// 			"Sorry, something went wrong. I am unable to process your query."
// 		);
// 	}
// });

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
})

client.login(process.env.BOT_TOKEN);
