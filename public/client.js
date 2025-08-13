// client.js - FINAL VERSION

document.addEventListener('DOMContentLoaded', () => {
    const talkButton = document.getElementById('talkButton');
    const statusDiv = document.getElementById('status');
    let isRecording = false;
    let mediaRecorder;
    let socket;

    // --- WebSocket Connection ---
    function connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        socket = new WebSocket(`${protocol}//${window.location.host}`);

        socket.onopen = () => {
            statusDiv.textContent = 'Click to speak';
            talkButton.disabled = false;
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.text) {
                // Use the browser's Speech Synthesis to speak the text
                speak(data.text);
            } else if (data.error) {
                console.error('Error from server:', data.error);
                statusDiv.textContent = `Error: ${data.error}`;
            }
        };

        socket.onclose = () => {
            statusDiv.textContent = 'Connection lost. Please refresh.';
            talkButton.disabled = true;
        };
        socket.onerror = () => {
            statusDiv.textContent = 'Connection error.';
            talkButton.disabled = true;
        };
    }

    // --- Text-to-Speech Function ---
    function speak(text) {
        // Stop any ongoing speech to handle interruptions
        window.speechSynthesis.cancel(); 

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            statusDiv.textContent = 'AI is speaking...';
            talkButton.disabled = true; // Disable button while AI speaks
        };
        utterance.onend = () => {
            statusDiv.textContent = 'Click to speak';
            talkButton.disabled = false; // Re-enable button after AI finishes
        };
        window.speechSynthesis.speak(utterance);
    }

    // --- Microphone Recording Functions ---
    async function startRecording() {
        // If AI is speaking, interrupt it.
        window.speechSynthesis.cancel();

        isRecording = true;
        talkButton.textContent = 'Stop & Process';
        statusDiv.textContent = 'Listening...';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                    socket.send(event.data);
                }
            };
            
            mediaRecorder.start(300); // Send audio data every 300ms
        } catch (err) {
            console.error('Error accessing microphone:', err);
            statusDiv.textContent = 'Could not access microphone.';
            isRecording = false;
            talkButton.textContent = 'Start Talking';
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            // Once stopped, ondataavailable will fire one last time with remaining data
        }
        isRecording = false;
        talkButton.textContent = 'Start Talking';
        statusDiv.textContent = 'Processing...';
    }

    // --- Event Listener ---
    talkButton.addEventListener('click', () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });

    // --- Initial Setup ---
    talkButton.disabled = true;
    connectWebSocket();
});