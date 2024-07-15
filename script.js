// Canvas drawing functionality
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

// Clear canvas button
document.getElementById('clear-canvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Apply to Bitmoji button
document.getElementById('apply-to-bitmoji').addEventListener('click', async () => {
    const drawnTop = document.getElementById('drawn-top');
    const imageData = canvas.toDataURL();

    try {
        const response = await fetch('/try-on', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        drawnTop.src = result.result;
        drawnTop.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to process the image. Please try again.');
    }
});

// Search Myntra button
document.getElementById('search-myntra').addEventListener('click', () => {
    document.getElementById('results-area').style.display = 'block';
});

// See similar items button
document.getElementById('see-similar').addEventListener('click', () => {
    alert('We will notify you when similar items are available!');
});

// Additional utility functions

function showLoading() {
    // Add a loading indicator to the page
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.textContent = 'Processing...';
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    // Remove the loading indicator
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Error handling function
function handleError(error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
}