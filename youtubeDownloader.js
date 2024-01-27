const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());

app.listen(4000, () => {
    console.log('Server works');
});

app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;
        res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
        const outputPath = 'audio.mp3';
        
        const response = await ytdl(URL, { format: 'mp3', filter: 'audioonly' });
        response.pipe(res);

        const audiosFolderPath = path.join(__dirname, 'audios');
        
        if (!fs.existsSync(audiosFolderPath)) {
            fs.mkdirSync(audiosFolderPath);
        }

        const fullOutputPath = path.join(audiosFolderPath, outputPath);

        response.on('end', () => {
            console.log(`Download concluído: ${fullOutputPath}`);
        });

        response.pipe(fs.createWriteStream(fullOutputPath));
    } catch (error) {
        console.error('Erro durante o download:', error.message);
        res.status(500).send('Erro durante o download');
    }
});
