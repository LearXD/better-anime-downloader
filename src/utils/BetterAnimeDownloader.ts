import ffmpeg from 'fluent-ffmpeg';
import { JSDOM } from 'jsdom';
import Logger from './logger';

interface Options {
  token: string
}

export default class BetterAnimeDownloader {

  public constructor(public options: Options) {
  }

  public async findByUrl(url: string) {
    const headers = {
      cookie: `betteranime_session=${this.options.token}`,
      "Referer": url
    }

    const response = await fetch(url, { headers });

    if (response.status !== 200) {
      throw new Error('Website down or invalid URL')
    }

    const { window: { document: BetterWebsite } } = new JSDOM(await response.text())

    const anime = BetterWebsite.querySelector('.anime-title').querySelector('a').innerHTML;
    const episode = BetterWebsite.querySelector('.anime-title').querySelector('h3').innerHTML;
    const views = BetterWebsite.querySelector('.views').innerHTML.replace(/\D/g, '');
    const playerUrl = BetterWebsite.querySelector('iframe').src

    if (!anime || !episode || !views || !playerUrl) {
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
      anime,
      episode,
      views,
      url,
      cdnUrls
    }

  }

  public async download(link: string, outputFilename: string) {

    const logger = new Logger();

    return ffmpeg(link)
      .output(outputFilename)
      .on('start', (commandLine) => {
        console.log(`Starting to convert ${outputFilename}...`)
      })
      .on('progress', (progress) => {
        logger.clear();
        logger.log(`Processing: ${progress.percent.toFixed(2)}% done`)
      })
      .on('end', () => {
        logger.clear();
        logger.close()
        console.log(`Converted ${outputFilename}!`)
      })
      .run();
  }

}