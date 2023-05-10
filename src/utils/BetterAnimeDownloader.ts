import ffmpeg from 'fluent-ffmpeg';
import { JSDOM } from 'jsdom';
import Logger from './Logger';
import Progress from './Progress';

interface Options {
  token: string
}

interface DownloadOptions {
  quality: '1080p' | '720p' | '480p';
}

export default class BetterAnimeDownloader {

  public constructor(public options: Options) {
  }

  public async findByUrl(url: string, { quality = '480p' }: DownloadOptions) {

    const headers = {
      "cookie": `betteranime_session=${this.options.token}`,
      "Referer": url
    }

    const response = await fetch(url, { headers });

    if (response.status !== 200) {
      throw new Error('Website down or invalid URL')
    }

    const { window: BetterWindow } = new JSDOM(await response.text())

    const name = BetterWindow.document.querySelector('.anime-title').querySelector('a').innerHTML;
    const episode = BetterWindow.document.querySelector('.anime-title').querySelector('h3').innerHTML;
    const views = BetterWindow.document.querySelector('.views').innerHTML.replace(/\D/g, '');

    const qualityRegex = new RegExp(`qualityString\\["${quality}"\\]\\s*=\\s*"([^"]+)"`)
    const tokenRegex = new RegExp(/_token:"([^"]+)"/)

    let playerUrl: string;

    if (quality !== '1080p') {
      let playerInfo: string;
      let playerToken: string;

      BetterWindow.document.querySelectorAll('script').forEach((element) => {
        const found = element.innerHTML.toString().match(tokenRegex)
        if (found) {
          playerInfo = element.innerHTML.toString().match(qualityRegex)[1]
          playerToken = found[1]
          return;
        }
      });

      if (!playerInfo || !playerToken) {
        throw new Error(`No player token or info found for quality ${quality}`)
      }

      const changePlayerResponse = await fetch("https://betteranime.net/changePlayer", {
        headers: {
          ...headers,
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        "body": `_token=${playerToken}&info=${playerInfo}`,
        "method": "POST"
      });

      if (changePlayerResponse.status !== 200) {
        throw new Error('Error while changing player quality')
      }

      playerUrl = (await changePlayerResponse.json()).frameLink
    } else {
      playerUrl = BetterWindow.document.querySelector('iframe').src
    }

    if (!name || !episode || !views || !playerUrl) {
      throw new Error('The anime URL must be from BetterAnime')
    }

    const playerResponse = await fetch(playerUrl, { headers });
    const { window: { document: PlayerWebsite } } = new JSDOM(await playerResponse.text())


    const cdnUrls: any[] = []
    PlayerWebsite.querySelectorAll('script').forEach((element) => {
      const match = element.innerHTML.toString().trim().match(/https?:\/\/\S+\.m3u8/g);
      if (match && match.length > 0) {
        match.forEach((cndUrl) => {
          cdnUrls.push(cndUrl.split("\"")[4].replace(/\\/g, '')) // MELHORAR ISSO (TA UMA GAMBIARRA)
        });
      }
    })

    if (cdnUrls.length === 0) {
      throw new Error('No CDN URLs found')
    }

    return {
      name,
      episode,
      views,
      quality,
      url,
      cdnUrls
    }
  }

  public async download(link: string, outputFilename: string) {

    return new Promise((resolve, reject) => {
      const logger = new Logger();

      const progressBar: Progress = new Progress(100);
      progressBar.animatePrompt(500, logger)

      return ffmpeg(link)
        .output(outputFilename)
        .on('progress', (progress) => {
          if (progress) {
            progressBar.update(progress.percent)
            logger.clear();
            logger.setPrompt(progressBar.getPrompt())
            logger.log(`${progressBar.getProgressBar()} Speed: ${progress.currentKbps} KB/s | Video part ${progress.timemark}`)
          }
        })
        .on('error', (err) => {
          reject(err)
        })
        .on('end', () => {
          logger.clear();
          logger.close()
          resolve(true)
        })
        .run();
    });

  }

}