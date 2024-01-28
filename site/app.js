document.getElementById('downloadButton').addEventListener('click', async function() {
    const urlInput = document.getElementById('urlInput');
    const parametroURL = urlInput.value;

    if (!parametroURL) {
        displayMessage('Please enter a URL.', 1);
        return;
    }

    const downloadURL = `https://download-music-project.vercel.app/download?URL=${parametroURL}`;

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
    try {
        const response = await fetch(url, { mode: 'cors' });

        if (!response.ok) {
            throw new Error(`HTTP ERROR: ${response.status}`);
        }

        const blob = await response.blob();

        const responseHeaders = {};

        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        const match = responseHeaders['content-disposition'] && responseHeaders['content-disposition'].match(/filename="(.+)"/);

        if (!match) {
            throw new Error('Filename not found in Content-Disposition header');
        }

        const title = match[1];

        const urlObject = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = urlObject;

        a.download = `${title}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(urlObject);

        return { title };
        
    } catch (error) {
        console.error('Error during download:', error.message);
        throw error;
    }
}
