document.getElementById('downloadButton').addEventListener('click', async function() {
    const urlInput = document.getElementById('urlInput');
    const parametroURL = urlInput.value;

    if (!parametroURL) {
        displayErrorMessage('Please enter a URL.');
        return;
    }

    const downloadURL = `https://download-music-project.vercel.app/download?URL=${encodeURIComponent(parametroURL)}`;
    
    try {
        await downloadFile(downloadURL);
        displayMessage('Your download will start.');
    } catch (error) {
        console.error('Error during download:', error.message);
        displayMessage('Error during download. Please try again.');
    }
});

function displayMessage(message) {
    const errorDiv = document.getElementById('message');
    errorDiv.style.display = "block";
    errorDiv.textContent = message;
}

async function downloadFile(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
    }

    const blob = await response.blob();
    const urlObject = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = urlObject;

    const randomId = Math.floor(Math.random() * 1000000);
    a.download = `music_${randomId}.mp3`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(urlObject);
}
