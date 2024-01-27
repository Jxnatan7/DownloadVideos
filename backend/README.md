# YouTube MP3 Downloader

## Descrição
Este é um projeto simples criado com Node.js para baixar vídeos do YouTube como arquivos .mp3.

## Requisitos
Certifique-se de ter o Node.js e o npm instalados em sua máquina antes de executar este aplicativo.

## Instalação
1. Clone este repositório para o seu ambiente local.
   ```bash
   git clone https://github.com/Jxnatan7/DownloadVideos
   ```
2. Navegue até o diretório do projeto.
   ```bash
   cd DownloadVideos
   ```
3. Instale as dependências.
   ```bash
   npm install
   ```

## Uso Local
1. Inicie o servidor.
   ```bash
   npm start
   ```
2. Faça uma requisição HTTP do tipo GET para `http://localhost:4000/download?URL={VIDEO_URL}` enviando o url do vídeo como parâmetro.

## Utilizando a API
Você também pode usar a API para baixar seus áudios. Envie uma solicitação GET para `https://download-music-project.vercel.app/download?URL=${VIDEO_URL}` enviando o url do vídeo como parâmetro.

## Utilizando o FRONTEND
Ou você pode utilizar o frontend em `https://jxnatan7.github.io/DownloadVideos/site/index.html` para baixar o arquivo .mp3.

## Contribuição
Sinta-se à vontade para contribuir para o projeto. Abra problemas ou envie pull requests.


---
