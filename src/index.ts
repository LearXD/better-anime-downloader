import { program } from 'commander';
import BetterAnimeDownloader from './utils/BetterAnimeDownloader';

import dotenv from 'dotenv'
import ffmpeg from 'fluent-ffmpeg';

const getOutputFile = (anime: string, episode: string) => {
  const animeName = anime.replace(/\s/g, '_')
  const episodeNumber = episode.replace(/\s/g, '_')
  return `${animeName}_${episodeNumber}.mp4`
}

program
  .version('BetterAnime Dowloader v0.0.1')
  .description('Download animes from BetterAnime')
  .helpOption('-h, --help', 'Display help for command')
  .showHelpAfterError()
  .usage('<url> [options]')
  .arguments('<url>')
  .option('-f, --file <output>', 'File name to save the video')
  .option('-t, --token <token>', 'BetterAnime token')
  .action(async (url, options) => {

    dotenv.config()

    if (!options.token && !process.env.BETTER_TOKEN) {
      throw new Error('Token is required')
    }

    const betterDownloader = new BetterAnimeDownloader({
      token: options.token || process.env.BETTER_TOKEN
    })

    try {
      console.log(`Starting download...`)
      const anime = await betterDownloader.findByUrl(url)

      console.log(
        ` 
          ██╗░░░░░███████╗░█████╗░██████╗░██╗░░██╗██████╗░
          ██║░░░░░██╔════╝██╔══██╗██╔══██╗╚██╗██╔╝██╔══██╗
          ██║░░░░░█████╗░░███████║██████╔╝░╚███╔╝░██║░░██║
          ██║░░░░░██╔══╝░░██╔══██║██╔══██╗░██╔██╗░██║░░██║
          ███████╗███████╗██║░░██║██║░░██║██╔╝╚██╗██████╔╝
          ╚══════╝╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░
                  (https://github.com/LearXD)
                    Better Anime Downloader
                       Version: 1.0.0

          Anime Name: ${anime.anime}
          Episode: ${anime.episode}
          Views: ${anime.views}
      `)

      const { cdnUrls: [cdnUrl] } = anime
      betterDownloader.download(
        cdnUrl,
        options.file || getOutputFile(anime.anime, anime.episode)
      )

    } catch (error: any) {
      console.log(error.message)
    }

  })



// check if user have ffmpeg installed
ffmpeg.getAvailableFormats((err, formats) => {
  if (err) {
    console.log('\nYou dont have ffmpeg installed')
    console.log('Using ffmpeg from ffmpeg-installer (maybe it will not work)\n')
    ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);
  }
  program.parse(process.argv)
})

