import {Telegraf, ContextMessageUpdate} from 'telegraf/typings';
import {PhotoEditor} from './photo-editor';
import {Config} from './config';
import {join as pathJoin} from 'path';

import {get as httpGet} from 'request';
import * as chalk from 'chalk';
import {readFileSync} from 'fs';

enum COMMAND {
  START = 'start',
  HELP = 'help'
}

const START_MSG = `
*Ale's InstaPhotos*

Avrà anche dei difetti...
`;

const HELP_MSG = `
Non devi fare niente.
Aspetta solo che Ale posti una foto.
`;

export class BotSetup {

  private static readonly MIDDLEWARES = [BotSetup.authorizedUsersMiddleware];

  // Get Photo Editor instance
  private static photoEditor = PhotoEditor.instance();
  private static sticker: Buffer | null = null;

  private static readonly ASSETS_PATH = pathJoin(__dirname, '../assets/');


  static setupBot(bot: Telegraf<ContextMessageUpdate>) {

    // Setup for groups
    (bot as any).telegram.getMe().then((botInfo) => {
      (bot as any).options.username = botInfo.username;
    });

    // Stats middleware
    this.setupMiddlewares(bot);


    // Start message ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    (bot as any).start((async ({replyWithMarkdown}: ContextMessageUpdate) => {
      try {
        await replyWithMarkdown(START_MSG);
      } catch (err) {
        this.printErr(COMMAND.START, err);
      }
    }) as any);

    // Help message ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    bot.command(COMMAND.HELP, (async ({replyWithMarkdown}: ContextMessageUpdate) => {
      try {
        await replyWithMarkdown(HELP_MSG);
      } catch (err) {
        this.printErr(COMMAND.HELP, err);
      }
    }) as any);


    // Photo reply ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    (bot as any).on('photo', ...this.MIDDLEWARES, (async ({message, reply, replyWithPhoto, replyWithSticker}: ContextMessageUpdate) => {
      console.log(chalk.default.blue('Received photo...'));

      try {
        if (message && message.photo && message.photo[0]) {

          const fileId = message.photo[message.photo.length - 1].file_id;

          const photoInfo: {file_id: string; file_size: number; file_path: string} = await (bot as any).telegram.getFile(fileId);
          const inputPhotoPath = await this.downloadPhoto(photoInfo.file_path);

          const outPhotoBuffer = await this.photoEditor.editPhoto(inputPhotoPath);

          console.log(chalk.default.blue('Sending photo...'));
          await replyWithPhoto({source: outPhotoBuffer, filename: 'edited.jpg'}, {caption: 'Avrà anche dei difetti!'});

          await replyWithSticker({source: this.getSticker()});
        }

      } catch (err) {
        console.error(chalk.default.red('Error occurred while responding to photo: ' + err));
      }
    }) as any);


  }

  private static setupMiddlewares(bot: Telegraf<ContextMessageUpdate>) {

    // Handle errors
    (bot as any).catch(err => {
      console.error(chalk.default.bold.red('> Bot error!'), err);
    });

  }


  private static printErr(command: string, err: any) {
    console.error(chalk.default.bold.red(`> Error while replying to command '${command}':`), err);
  }

  // Utils ////////////////////////////////////////////////////////////////////////////////////////

  private static getSticker(): Buffer {

    if (!this.sticker) {
      this.sticker = readFileSync(pathJoin(this.ASSETS_PATH, 'ab.png'));
    }

    return this.sticker;
  }

  private static async downloadPhoto(filePath: string): Promise<Buffer> {
    console.log(chalk.default.blue('Downloading photo...'));
    const url = `https://api.telegram.org/file/bot${Config.instance().getBotToken()}/${filePath}`;

    return new Promise<Buffer>((resolve, reject) => {
      httpGet(url, {encoding: 'binary'}, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Status code is ${res.statusCode}`));
        }

        resolve(new Buffer(res.body, 'binary'));
      });
    });
  }

  // Middlewares //////////////////////////////////////////////////////////////////////////////

  private static async authorizedUsersMiddleware({from, reply}: ContextMessageUpdate, next: () => any) {
    if (from && (from.username === 'andr35' || from.username === 'Alessandro994')) {
      return next();
    }
    // Else -> do nothing
  }

}
