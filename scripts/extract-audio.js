const fs = require('fs');

// Create assets/audio directory if it doesn't exist
if (!fs.existsSync('assets/audio')) {
    fs.mkdirSync('assets/audio', { recursive: true });
}

// Read the HTML file
const html = fs.readFileSync('index.html', 'utf8');

// Function to extract base64 data
function extractBase64(str) {
    const match = str.match(/data:audio\/mpeg;base64,([^"]*)/);
    return match ? match[1] : null;
}

// Extract and save each audio file
const audioIds = ['offline-sound-press', 'offline-sound-hit', 'offline-sound-reached'];
audioIds.forEach(id => {
    const regex = new RegExp(`<audio id="${id}"[^>]*src="([^"]*)"`, 'i');
    const match = html.match(regex);
    if (match) {
        const base64Data = extractBase64(match[1]);
        if (base64Data) {
            const buffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(`assets/audio/${id}.mp3`, buffer);
            console.log(`Extracted ${id}.mp3`);
        }
    }
});
