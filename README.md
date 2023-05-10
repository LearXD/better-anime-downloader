<div align="center">

![Logo](images/logo.png)
  
</div>

# Better Anime Downloader

A program to download animes from Better Animes website!

## NodeJS Installation

To install NodeJS on your system, follow these steps:

### Linux

1. Open your terminal
2. Update your system's package list: `sudo apt update`
3. Install Node.js: `sudo apt install nodejs`
4. Verify that Node.js was installed correctly: `node -v`

### Windows

1. Download the Node.js installer from the official website: https://nodejs.org/en/download/
2. Run the installer and follow the prompts to install Node.js
3. Verify that Node.js was installed correctly by opening a command prompt and typing `node -v`

### Termux

1. Open your Termux terminal
2. Update your system's package list: `apt update`
3. Install Node.js: `pkg install nodejs-lts`
4. Verify that Node.js was installed correctly: `node -v`

## Project Installation 

To install the project see [releases](https://github.com/LearXD/better-anime-downloader/releases), or follow these steps:

1. Clone the repository: `git clone https://github.com/LearXD/better-anime-downloader.git`
2. Navigate to the project directory: `cd better-anime-downloader`
3. Install the dependencies: `npm install`
4. Compile the TypeScript files: `tsc`
5. Start the program: `node .`

> **Alert**
> To use this tool, you will need to obtain an access token from the Better Animes website by inspecting your cookies. The access token should be included in the headers of your requests to the website. Please ensure that you have obtained a valid access token before using this tool. (if you prefer, see the default.env, and rename it to .env, and put your token there)

## Usage
```bash
# LINUX (...TERMUX)
$ sudo chmod +x download.sh
$ ./download.sh <url> [options]

# WINDOWS
$ download <url> [options]

Options:
-V, --version output the version number
-Q, --quality <quality> must be 480p, 720p, 1080p
-h, --help display help for command
-t, --token <token> access token to use
-f, --file <output> file name to save the video
```

# TODO

- [x] Download anime
- [x] Download anime with quality
- [x] Download anime with custom file name
- [x] Download anime with access token
- [x] Add download progress
- [x] Add download progress bar
- [x] Add download speed

- [ ] Easy method for getting access token
- [ ] Download full playlist


## Credits

Credit goes to LearXD for their contributions to this project.
