const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();

app.use(cors());

app.listen(4000, () => {
    console.log('Server works');
});

app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;
        res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
        
        const response = await ytdl(URL, { format: 'mp3', filter: 'audioonly' });
        response.pipe(res);

        return response;
    } catch (error) {
        console.error('Erro durante o download:', error.message);
        res.status(500).send('Erro durante o download');
    }
});
