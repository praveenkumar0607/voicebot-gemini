// server.js - FINAL VERSION

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

wss.on('connection', async (ws) => {
    console.log('Client connected');

    try {
        const systemInstruction = {
             parts: [{text: "You are Rev, a helpful assistant for Revolt Motors. Your knowledge is strictly limited to Revolt Motors' products, services, and history. Do not answer questions outside of this scope."}],
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-latest", // Using a stable, standard model
            systemInstruction: systemInstruction,
        });
        
        const chat = model.startChat();

        ws.on('message', async (message) => {
            try {
                const audioChunk = message;
                const result = await chat.sendMessageStream([{ inlineData: { mimeType: 'audio/webm', data: audioChunk.toString('base64') } }]);
                
                let fullResponse = "";
                // The API will now return TEXT, not audio. We collect the text chunks.
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    fullResponse += chunkText;
                }

                // Send the complete text response back to the client
                ws.send(JSON.stringify({ text: fullResponse }));

            } catch (error) {
                console.error('Error during chat:', error);
                ws.send(JSON.stringify({ error: 'An error occurred during the chat.' }));
            }
        });

        ws.on('close', () => console.log('Client disconnected'));
        ws.on('error', (error) => console.error('WebSocket error:', error));

    } catch (error) {
        console.error('Failed to initialize generative model:', error);
        ws.close(1011, 'Failed to initialize AI model.');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});