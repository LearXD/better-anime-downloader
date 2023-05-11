import readline from 'readline';
import chalk from 'chalk';

interface LoggerOptions {
  prompt?: string;
}

export default class Logger {

  public rl: readline.Interface;

  constructor(private options?: LoggerOptions) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: options?.prompt || ''
    });
  }

  setPrompt(prompt: string) {
    this.rl.setPrompt(prompt);
  }

  resetPrompt() {
    this.rl.setPrompt(this.options?.prompt || '');
  }

  clear() {
    this.rl.write(null, { ctrl: true, name: 'u' });
  }

  log(text: string) {
    this.rl.write(text);
  }

  close() {
    this.rl.close();
  }
}
