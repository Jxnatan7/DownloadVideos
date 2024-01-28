const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
});


app.use(cors({
    origin: 'https://jxnatan7.github.io/DownloadVideos/site/index.html',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.listen(8080, () => {
    console.log('Server works');
});

app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;

        const info = await ytdl.getInfo(URL);

        const durationSeconds = parseInt(info.videoDetails.lengthSeconds, 10);
        
        if (durationSeconds > 720) { // 12 minutes
            throw new Error('The video is too long to process');
        }

        const stream = ytdl(URL, { format: 'mp4', quality: 140 });

        const ffmpegCommand = ffmpeg();
        ffmpegCommand.input(stream);
        ffmpegCommand.audioCodec('libmp3lame');
        ffmpegCommand.audioBitrate(192);
        ffmpegCommand.format('mp3');

        const videoTitle = info.videoDetails.title;

        res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp3"`);

        ffmpegCommand.on('end', () => {
            console.log('Conversion finished');
        });

        ffmpegCommand.on('error', (err) => {
            console.error('Error during conversion:', err);
            res.status(500).send('Error during conversion');
        });

        ffmpegCommand.pipe(res, { end: true });
    } catch (error) {
        console.error('Error during download:', error.message);
        res.status(500).send('Error during download');
    }
});
