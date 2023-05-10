import chalk from "chalk";
import Logger from "./Logger";

export default class Progress {

  public current: number = 0;
  public barSize = 20

  public promps = ['|', '/', '-', '\\']
  public prompIndex = 0;
  public prompAnimation: NodeJS.Timer;

  constructor(public total: number) {
  }

  public animatePrompt(speed: number = 1000, logger: Logger) {
    this.prompAnimation = setInterval(() => {
      this.prompIndex = (this.prompIndex + 1) % this.promps.length;
      logger.setPrompt(this.getPrompt())
    }, speed)
  }

  public getPrompt() {
    return ` ${this.promps[this.prompIndex]} `;
  }

  public update(current: number) {
    this.current = current;
  }

  public getPercentage() {
    return (this.getReason() * 100).toFixed(1)
  }

  public getReason() {
    return Math.min(this.current / this.total, 1);
  }

  public getProgressBar() {
    const reason = this.getReason();
    const filledBarSize = Math.round(reason * this.barSize);
    const restBarSize = 20 - filledBarSize;
    return `[${chalk.green("=".repeat(filledBarSize))}${chalk.green(">")}${chalk.gray("=".repeat(restBarSize))}] (${this.getPercentage()}%)`
  }

}