import {createServer} from 'http';
import {Telegraf as Tg, ContextMessageUpdate} from 'telegraf/typings';
import {Config} from './config';
import {BotSetup} from './bot-setup';

import * as Telegraf from 'telegraf';
import * as Telegram from 'telegraf/telegram';
import * as chalk from 'chalk';


// //////////////////////////////////////////////////
//  Init
// //////////////////////////////////////////////////

// Load config and Ports
const config = Config.instance();

// Create bot and telgram
const bot: Tg<ContextMessageUpdate> = new Telegraf<ContextMessageUpdate>(config.getBotToken());
const telegram = new Telegram(config.getBotToken(), {webhookReply: false});

// Setup the bot commands & co
BotSetup.setupBot(bot, telegram);


// //////////////////////////////////////////////////
//  Start bot
// //////////////////////////////////////////////////

console.log(chalk.default.green('> Starting Bot...'));

bot.startPolling(); // Polling mode

// bot.startWebhook(config.getWebHookPath(), null as any, config.getPort()); // Webhook mode

console.log(chalk.default.bold.green('> Bot started!'));

createServer((request, response) => {
  response.end('Hello!');
}).listen(config.getPort());
