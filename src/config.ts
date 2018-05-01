import * as chalk from 'chalk';

export class Config {

  private static config: Config;

  private readonly ENV_BOT_TOKEN = 'BOT_TOKEN';
  private readonly ENV_PORT = 'PORT';
  private readonly ENV_WEBHOOK_PATH = 'WEBHOOK_PATH';

  private readonly botToken: string;
  private readonly port: number;
  private readonly webHookPath: string;

  static instance(): Config {
    if (!this.config) {
      this.config = new Config();
    }
    return this.config;
  }

  private constructor() {

    this.botToken = process.env[this.ENV_BOT_TOKEN] || '';
    this.port = parseInt(process.env[this.ENV_PORT] || '3000', 10);
    this.webHookPath = process.env[this.ENV_WEBHOOK_PATH] || '';

    if (!this.botToken) {
      this.errMissingEnvVar(this.ENV_BOT_TOKEN);
    }

    if (!this.port) {
      this.errMissingEnvVar(this.ENV_PORT);
    }

    if (!this.webHookPath) {
      this.errMissingEnvVar(this.ENV_WEBHOOK_PATH);
    }

  }

  getBotToken(): string {
    return this.botToken;
  }

  getPort(): number {
    return this.port;
  }

  getWebHookPath(): string {
    return this.webHookPath;
  }

  private errMissingEnvVar(envVar: string) {
    console.warn(chalk.default.bold.red(`> Missing env var ${envVar}`));
    process.exit(-1);
  }
}
