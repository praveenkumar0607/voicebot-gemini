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
    function speak(text) {
        window.speechSynthesis.cancel(); 

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            statusDiv.textContent = 'AI is speaking...';
            talkButton.disabled = true;
        };
        utterance.onend = () => {
            statusDiv.textContent = 'Click to speak';
            talkButton.disabled = false;
        };
        window.speechSynthesis.speak(utterance);
    }

    async function startRecording() {
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
            
            mediaRecorder.start(300);
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
        }
        isRecording = false;
        talkButton.textContent = 'Start Talking';
        statusDiv.textContent = 'Processing...';
    }

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
