const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath.path);

const app = express();
const PORT = 4000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: 'Content-Disposition',
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;

        if (!URL || typeof URL !== 'string') {
            throw new Error('Invalid or missing YouTube video URL');
        }

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

        const videoTitle = info.videoDetails.title.replace(/[^\w\s\-]/g, '');
;
        res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp3"`);

        ffmpegCommand.on('end', () => {
            console.info(`Conversion finished for ${videoTitle}`);
        });

        ffmpegCommand.on('error', (err) => {
            console.error('Error during conversion:', err);
            res.status(500).json({ error: 'Error during conversion', message: err.message });
        });

        ffmpegCommand.pipe(res, { end: true });
    } catch (error) {
        console.error('Error during download:', error);
        res.status(500).json({ error: 'Error during download', message: error.message });
    }
});
