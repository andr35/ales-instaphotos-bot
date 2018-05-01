import * as Jimp from 'jimp';
import * as chalk from 'chalk';

export class PhotoEditor {

  private static _instance: PhotoEditor;

  static instance(): PhotoEditor {
    if (!this._instance) {
      this._instance = new PhotoEditor();
    }
    return this._instance;
  }

  private constructor() {}

  // ////////////////////////////////////////////////
  // FUNCTIONS
  // ////////////////////////////////////////////////

  async editPhoto(photo: string | Buffer): Promise<Buffer> {
    const saturValue = this.getRandomInt(30, 45);
    console.log(chalk.default.blue(`Editing photo using saturation value ${saturValue}...`));

    const img = await Jimp.read(photo);


    (img as any).color([
      {apply: 'saturate', params: [saturValue]}
    ]
    );

    return new Promise<Buffer>((resolve, reject) => {
      img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
        if (err) {
          return reject(err);
        }
        resolve(buf);
      });
    });
  }


  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
