document.getElementById('downloadButton').addEventListener('click', function() {
    const urlInput = document.getElementById('urlInput');
    const parametroURL = urlInput.value;

    if (!parametroURL) {
        alert('Por favor, insira uma URL.');
        return;
    }

    const downloadURL = `https://download-music-project.vercel.app/download?URL=${parametroURL}`;

    fetch(downloadURL)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'teste.mp3';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });
});