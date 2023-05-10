import { program } from 'commander';
import BetterAnimeDownloader from './utils/BetterAnimeDownloader';
import dotenv from 'dotenv'
import ffmpeg from 'fluent-ffmpeg';

dotenv.config()

ffmpeg.getAvailableFormats((err, formats) => {
  if (err || process.env.USE_NODE_FFMPEG) {
    console.log('\nYou dont have ffmpeg installed')
    console.log('Using ffmpeg from ffmpeg-installer (maybe it will not work)\n')
    ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);
  }
  program.parse(process.argv)
})

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
  .option('-Q, --quality <quality>', 'Anime quality (480p, 720p, 1080p)')
  .option('-t, --token <token>', 'BetterAnime token')
  .action(async (url, options) => {

    if (!options.token && !process.env.BETTER_TOKEN) {
      throw new Error('Token is required')
    }

    const betterDownloader = new BetterAnimeDownloader({
      token: options.token || process.env.BETTER_TOKEN
    })

    try {
      console.log(`\n🔎 Finding anime... Wait a moment.`)
      const anime = await betterDownloader.findByUrl(url, { quality: options.quality || '480p' })

      console.log(
        ` 
        ██╗░░░░░███████╗░█████╗░██████╗░██╗░░██╗██████╗░
        ██║░░░░░██╔════╝██╔══██╗██╔══██╗╚██╗██╔╝██╔══██╗
        ██║░░░░░█████╗░░███████║██████╔╝░╚███╔╝░██║░░██║
        ██║░░░░░██╔══╝░░██╔══██║██╔══██╗░██╔██╗░██║░░██║
        ███████╗███████╗██║░░██║██║░░██║██╔╝╚██╗██████╔╝
        ╚══════╝╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░
                (https://learxd.dev/github)
                  Better Anime Downloader
                     Version: 1.0.0

🏷️ Anime Name: ${anime.name}
🌟 Quality: ${anime.quality}
🎬 Episode: ${anime.episode}
👀 Views: ${anime.views}
📁 Output File: ${options.file || getOutputFile(anime.name, anime.episode)}

    ⚠ The BetterAnime limits the download speed. If you want you 
      can download more than one episode at the same time. ⚠
`)
      const { cdnUrls: [cdnUrl] } = anime

      const filename = options.file || getOutputFile(anime.name, anime.episode);

      betterDownloader.download(cdnUrl, filename)
        .then(() => {
          console.log(`\n🎉 Downloaded ${anime.name} ${anime.episode}!`)
          process.exit(0)
        })
        .catch((err) => {
          console.log(`\n❌ Error: ${err.message}`)
          process.exit(0)
        })

    } catch (error: any) {
      console.log(error.message)
    }

  });