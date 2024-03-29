const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
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

        const videoTitle = info.videoDetails.title.replace(/[^\w\s\-]/g, '');

        res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp3"`);

        stream.on('end', () => {
            console.info(`Conversion finished for ${videoTitle}`);
        });

        stream.on('error', (err) => {
            console.error('Error during conversion:', err);
            res.status(500).json({ error: 'Error during conversion', message: err.message });
        });

        stream.pipe(res, { end: true });
    } catch (error) {
        console.error('Error during download:', error);
        res.status(500).json({ error: 'Error during download', message: error.message });
    }
});
