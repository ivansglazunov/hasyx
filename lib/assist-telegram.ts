import readline from 'readline';
import Debug from './debug';
import { createRlInterface, askYesNo, askForInput, parseEnvFile, writeEnvFile } from './assist-common';
import path from 'path';
import fs from 'fs-extra';
import spawn from 'cross-spawn'; // For potential calibration scripts

const debug = Debug('assist:telegram');

export async function configureTelegramBot(rl: readline.Interface, envPath: string): Promise<Record<string, string>> {
  debug('Configuring Telegram Bot'); console.log('🤖 Configuring Telegram Bot...');
  let envVars = parseEnvFile(envPath);
  let changed = false;

  console.log(
`To set up a Telegram Bot:
1. Talk to @BotFather on Telegram.
2. Create a new bot by sending /newbot.
3. Follow the instructions to choose a name and username for your bot.
4. BotFather will give you an API token. Copy it.`
  );

  // Configure TELEGRAM_BOT_TOKEN
  const currentToken = envVars.TELEGRAM_BOT_TOKEN;
  let newToken = currentToken;
  if (currentToken) {
    if (await askYesNo(rl, `Telegram Bot Token is already set (starts with: ${currentToken.substring(0, 8)}...). Do you want to change it?`, false)) {
      newToken = await askForInput(rl, 'Enter new Telegram Bot API Token (press Enter to keep current)', currentToken);
    } else {
      newToken = currentToken; // Explicitly keep current if not changing
    }
  } else {
    newToken = await askForInput(rl, 'Enter Telegram Bot API Token');
  }
  if (newToken !== currentToken) {
    envVars.TELEGRAM_BOT_TOKEN = newToken;
    changed = true;
  }

  // Configure TELEGRAM_BOT_NAME
  const currentBotName = envVars.TELEGRAM_BOT_NAME;
  let newBotName = currentBotName;
  if (currentBotName) {
    if (await askYesNo(rl, `Telegram Bot Username is already set: ${currentBotName}. Do you want to change it?`, false)) {
      newBotName = await askForInput(rl, 'Enter new Telegram Bot Username (e.g., my_project_bot, press Enter to keep current)', currentBotName);
    } else {
      newBotName = currentBotName;
    }
  } else {
    newBotName = await askForInput(rl, 'Enter Telegram Bot Username (e.g., my_project_bot)');
  }
  if (newBotName !== currentBotName) {
    envVars.TELEGRAM_BOT_NAME = newBotName;
    changed = true;
  }
  
  // Configure TELEGRAM_ADMIN_CHAT_ID
  const currentAdminChatId = envVars.TELEGRAM_ADMIN_CHAT_ID;
  let newAdminChatId = currentAdminChatId;
  if (currentAdminChatId) {
    if (await askYesNo(rl, `Telegram Admin Chat ID is already set: ${currentAdminChatId}. Do you want to change it?`, false)) {
      newAdminChatId = await askForInput(rl, 'Enter new Telegram Admin Chat ID (for message forwarding, press Enter to keep current)', currentAdminChatId);
    } else {
      newAdminChatId = currentAdminChatId;
    }
  } else {
     if (await askYesNo(rl, 'Do you want to set up a Telegram Admin Chat ID for message forwarding (optional)?', false)){
        newAdminChatId = await askForInput(rl, 'Enter Telegram Admin Chat ID (e.g., -100123... or @groupusername)');
     } else {
        delete envVars.TELEGRAM_ADMIN_CHAT_ID; // Remove if user opts out and it wasn't set
     }
  }
  if (newAdminChatId !== currentAdminChatId) {
    if (newAdminChatId && newAdminChatId.trim() !== '') {
        envVars.TELEGRAM_ADMIN_CHAT_ID = newAdminChatId;
    } else {
        delete envVars.TELEGRAM_ADMIN_CHAT_ID; // Remove if new value is empty string
    }
    changed = true;
  }

  if (changed) {
    writeEnvFile(envPath, envVars);
    console.log('✅ Telegram Bot configuration updated.');
  } else {
    console.log('ℹ️ No changes made to Telegram Bot configuration.');
  }
  return envVars;
}

export async function configureTelegramChannel(rl: readline.Interface, envPath: string): Promise<Record<string, string>> {
  debug('Configuring Telegram Channel'); console.log('📢 Configuring Telegram Channel for notifications...');
  let envVars = parseEnvFile(envPath);
  let changed = false;

  const currentChannelId = envVars.TELEGRAM_CHANNEL_ID;
  let newChannelId = currentChannelId;

  if (currentChannelId) {
    console.log(`✅ Telegram Channel ID already configured: ${currentChannelId}.`);
    if (!await askYesNo(rl, 'Do you want to reconfigure the Telegram Channel ID?', false)) {
      return envVars; // No changes if user opts out
    }
    // Proceed to ask for new value if they want to reconfigure
    newChannelId = await askForInput(rl, 'Enter new Telegram Channel ID (e.g., @mychannel or -100123..., press Enter to keep current)', currentChannelId);
  } else {
    if (await askYesNo(rl, 'Do you want to set up a Telegram Channel for notifications?', true)) {
      console.log(
`To set up a Telegram Channel for notifications:
1. Create a new public or private Telegram channel.
2. Add your Telegram Bot (configured in the previous step) to the channel as an administrator.
3. Get the Channel ID:
   - For public channels: it's the username (e.g., @mychannelname).
   - For private channels: temporarily make it public to get its username, or use a bot like @RawDataBot, forward a message from the channel to it, and look for "chat": { "id": YOUR_CHANNEL_ID } (it will be a negative number).
   - Ensure the ID starts with '@' for public channels if using the username, or is the numeric ID for private channels.`
      );
      newChannelId = await askForInput(rl, 'Enter Telegram Channel ID (e.g., @mychannel or -100123...)');
    } else {
      delete envVars.TELEGRAM_CHANNEL_ID;
      console.log('Skipping Telegram Channel setup.');
      return envVars; // No changes if user opts out
    }
  }
  
  if (newChannelId !== currentChannelId) {
    if (newChannelId && newChannelId.trim() !== '') {
        envVars.TELEGRAM_CHANNEL_ID = newChannelId;
    } else {
        delete envVars.TELEGRAM_CHANNEL_ID; // Remove if new value is empty string
    }
    changed = true;
  }

  if (changed) {
    writeEnvFile(envPath, envVars);
    console.log('✅ Telegram Channel configuration updated.');
  } else {
    console.log('ℹ️ No changes made to Telegram Channel configuration.');
  }
  return envVars;
}

export async function runTelegramSetupAndCalibration(rl: readline.Interface, envPath: string, options: { skipTelegram?: boolean, projectName?: string }): Promise<void> {
  if (options.skipTelegram) {
    debug('Skipping all Telegram setup due to options.');
    console.log('⏭️ Skipping Telegram setup.');
    return;
  }
  await configureTelegramBot(rl, envPath);
  await configureTelegramChannel(rl, envPath);
  
  const envVars = parseEnvFile(envPath);
  if (envVars.TELEGRAM_BOT_TOKEN) {
      if (await askYesNo(rl, 'Do you want to calibrate the Telegram Bot (set commands, webhook, etc.)?', false)) {
          await calibrateTelegramBot(rl, envPath, options.projectName || path.basename(process.cwd()));
      }
  } else {
      console.log('Telegram Bot Token not found, skipping calibration.');
  }
}

export async function calibrateTelegramBot(rl: readline.Interface, envPath: string, projectName: string): Promise<void> {
  console.log('🔧 Calibrating Telegram Bot...');
  const envVars = parseEnvFile(envPath);
  const token = envVars.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found in .env. Cannot calibrate bot.');
    return;
  }

  const botName = envVars.TELEGRAM_BOT_NAME || 'UnknownBot';
  const baseWebAppUrl = envVars.NEXT_PUBLIC_MAIN_URL || envVars.VERCEL_URL || envVars.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const webhookUrl = `${baseWebAppUrl}/api/telegram_bot`; // Corrected path for Hasyx default
  const menuButton = {
    type: 'web_app',
    text: `Open ${projectName}`,
    web_app: { url: baseWebAppUrl },
  };
  const commands = [
    { command: 'start', description: 'Start interacting with the bot' },
    { command: 'menu', description: `Open ${projectName} app` },
    // Add other commands as needed
  ];

  try {
    console.log(`Attempting to set webhook to: ${webhookUrl}`);
    const webhookSet = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}&drop_pending_updates=True`);
    const webhookResult = await webhookSet.json();
    if (webhookResult.ok) console.log(`✅ Webhook set to ${webhookUrl}`);
    else console.error('❌ Failed to set webhook:', webhookResult.description);

    console.log('Setting menu button...');
    const menuButtonSet = await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton?menu_button=${JSON.stringify(menuButton)}`);
    const menuButtonResult = await menuButtonSet.json();
    if (menuButtonResult.ok) console.log('✅ Menu button set.');
    else console.error('❌ Failed to set menu button:', menuButtonResult.description);

    console.log('Setting commands...');
    const commandsSet = await fetch(`https://api.telegram.org/bot${token}/setMyCommands?commands=${JSON.stringify(commands)}`);
    const commandsResult = await commandsSet.json();
    if (commandsResult.ok) console.log('✅ Commands set.');
    else console.error('❌ Failed to set commands:', commandsResult.description);

    console.log(`\n💡 Bot ${botName} calibrated. Ensure your application implements the ${webhookUrl} endpoint.`);
    console.log(`   Make sure to handle "message" and "callback_query" updates accordingly.`);

  } catch (error) {
    console.error('❌ Error during bot calibration:', error);
  }
}

// Main function for standalone execution
async function main() {
  const rl = createRlInterface();
  const envPath = path.join(process.cwd(), '.env');
  const projectName = path.basename(process.cwd());
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️ .env file not found. Telegram setup might require manual entry of all details or might fail.');
    writeEnvFile(envPath, {}); 
  }
  try {
    await runTelegramSetupAndCalibration(rl, envPath, { projectName });
    console.log('✅ Telegram Bot and Channel setup/calibration process complete.');
  } catch (error) {
    console.error('❌ Error during Telegram setup:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
} 