const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegStatic);

const app = express();

app.use(cors());

app.listen(8080, () => {
    console.log('Server works');
});

app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;

        res.header('Content-Disposition', 'attachment; filename="audio.mp3"');

        const info = await ytdl.getInfo(URL);

        const durationSeconds = parseInt(info.videoDetails.lengthSeconds, 10);
        
        if (durationSeconds > 720) { // 12 minutes
            throw new Error('The video is too long to process');
        }

        const stream = ytdl(URL, { format: 'mp4', quality: 140 });
        
        stream.on('error', (err) => {
            console.error('Error during download:', err.message);
            res.status(500).send('Error during download');
        });

        const ffmpegCommand = ffmpeg();
        ffmpegCommand.input(stream);
        ffmpegCommand.audioCodec('libmp3lame');
        ffmpegCommand.audioBitrate(192);
        ffmpegCommand.format('mp3');

        const videoTitle = info.videoDetails.title;

        res.json({ success: true, title: videoTitle });

        ffmpegCommand.pipe(res, { end: true });

        ffmpegCommand.on('end', () => {
            console.log('Conversion finished');
        });

        ffmpegCommand.on('error', (err) => {
            console.error('Error during conversion:', err);
            res.status(500).send('Error during conversion');
        });
    } catch (error) {
        console.error('Error during download:', error.message);
        res.status(500).send('Error during download');
    }
});