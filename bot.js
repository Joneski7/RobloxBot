const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const axios = require('axios');

const TOKEN = 'MTM2MTM5OTA3MjM5MjQ3ODg5MA.GtN8YU.OSJokzPBAyEarmSjAD4a49xop5kWGvlX5rDqzc';
const CLIENT_ID = '1361399072392478890';
const GUILD_ID = '1361398856088162495';
const VERIFY_ENDPOINT = 'https://0f871a2a-4448-4929-90e6-1fb146800c30-00-3ejrn1q5u27lu.worf.replit.dev/verify';

// ✅ Init bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ✅ Register command
const commands = [
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Link your Roblox account')
    .addStringOption(opt =>
      opt.setName('code')
        .setDescription('Your 7-digit Roblox code')
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Slash command registered.');
  } catch (e) {
    console.error('❌ Command registration failed:', e);
  }
})();

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'verify') {
    const code = interaction.options.getString('code');

    try {
        const res = await axios.post(VERIFY_ENDPOINT, {
            code,
            discord: interaction.user.tag
          });
      const data = res.data;

      if (data.success) {
        await interaction.reply(`✅ Verified as **${data.username}** (UserId: ${data.userId})`);
      } else {
        await interaction.reply('❌ Invalid or expired code.');
      }
    } catch (err) {
      console.error('❌ VERIFY API ERROR:', err.message);
      await interaction.reply('❌ Error contacting verify server.');
    }
  }
});

client.login(TOKEN);