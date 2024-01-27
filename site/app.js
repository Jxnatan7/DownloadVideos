document.getElementById('downloadButton').addEventListener('click', async function() {
    const urlInput = document.getElementById('urlInput');
    const parametroURL = urlInput.value;

    if (!parametroURL) {
        displayMessage('Please enter a URL.');
        return;
    }

    const downloadURL = `https://download-music-project.vercel.app/download?URL=${encodeURIComponent(parametroURL)}`;
    
    try {
        const { title } = await downloadFile(downloadURL);
        displayMessage(`Your download of ${title} start.`, 0);
    } catch (error) {
        console.error('Error during download:', error.message);
        displayMessage('Error during download. Please try again.', 1);
    }
});

function displayMessage(message, type) {
    const element = document.getElementById('message');
    element.style.display = "flex";
    type === 0 ? element.style.backgroundColor = "#09742D" : element.style.backgroundColor = "#DE3D45"; 
    element.textContent = message;
}

async function downloadFile(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
    }

    const responseClone = response.clone();

    const blob = await response.blob();

    const data = await responseClone.json();

    const title = data.title;

    const urlObject = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = urlObject;

    a.download = `${title}.mp3`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(urlObject);

    return { title };
}
