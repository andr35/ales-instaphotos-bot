import * as chalk from 'chalk';
import {createServer} from 'http';
import * as TelegrafImport from 'telegraf';
import {ContextMessageUpdate, Telegraf as Tg} from 'telegraf';
import {BotSetup} from './bot-setup';
import {Config} from './config';



// //////////////////////////////////////////////////
//  Init
// //////////////////////////////////////////////////

// Load config and Ports
const config = Config.instance();
// console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa', Telegraf);

// Create bot and telgram
const Telegraf: any = TelegrafImport as any;
const bot: Tg<ContextMessageUpdate> = new Telegraf(config.getBotToken());

// Setup the bot commands & co
BotSetup.setupBot(bot);


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
