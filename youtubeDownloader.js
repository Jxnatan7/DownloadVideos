const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();

app.use(cors());

app.listen(8080, () => {
    console.log('Server works');
});

const MAX_VIDEO_DURATION_SECONDS = 720; // 12 minutes

app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;
        res.header('Content-Disposition', 'attachment; filename="audio.mp3"');

        const info = await ytdl.getInfo(URL);
        const durationSeconds = parseInt(info.videoDetails.lengthSeconds, 10);

        if (durationSeconds > MAX_VIDEO_DURATION_SECONDS) {
            throw new Error('The video is too long to process');
        }

        ytdl(URL, { format: 'mp3', filter: 'audioonly' })
            .on('error', (err) => {
                console.error('Error during download:', err.message);
                res.status(500).send('Error during download');
            })
            .pipe(res);
    } catch (error) {
        console.error('Error during download:', error.message);
        res.status(500).send('Error during download');
    }
});
