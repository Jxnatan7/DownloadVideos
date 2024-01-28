document.getElementById('downloadButton').addEventListener('click', async function() {
    const urlInput = document.getElementById('urlInput');
    const parametroURL = urlInput.value;

    if (!parametroURL) {
        displayMessage('Please enter a URL.');
        return;
    }

    const downloadURL = `http://localhost:8080/download?URL=${encodeURIComponent(parametroURL)}`;
    
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
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ERROR: ${response.status}`);
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        const match = contentDisposition && contentDisposition.match(/filename="(.+)"/);

        if (!match) {
            throw new Error('Filename not found in Content-Disposition header');
        }

        const title = match[1];

        const blob = await response.blob();

        const urlObject = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = urlObject;

        a.download = title;

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
