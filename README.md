# Gemini Voice Assistant

A real-time, conversational voice interface that replicates the functionality of the Revolt Motors chatbot, built with the Google Gemini API and a Node.js backend.

---

## Overview

This project is a web application designed to provide a seamless voice-based conversational experience. Users can speak directly to an AI assistant, which is configured to answer questions exclusively about Revolt Motors. The application leverages the Google Gemini API for natural language understanding and response generation, with a server-to-server architecture to handle API requests securely.

The frontend uses standard web technologies to capture microphone input and the browser's built-in Web Speech API for text-to-speech, ensuring broad compatibility and low latency.

---

## Features

-   **Real-Time Conversation**: Engage in a natural, back-and-forth voice dialogue with the AI.
-   **Interruption Handling**: The user can interrupt the AI while it is speaking, and the system will listen to the new input immediately.
-   **Low Latency**: Optimized for quick responses to provide a fluid user experience.
-   **Focused Knowledge**: The AI is instructed to only provide information related to Revolt Motors.
-   **Modern UI**: A clean, professional, and responsive user interface with a dark theme.

---

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Real-time Communication**: WebSockets (`ws` library)
-   **AI & NLP**: Google Gemini API (`@google/generative-ai`)
-   **Frontend**: HTML5, CSS3, JavaScript
-   **Speech Synthesis**: Web Speech API (Browser built-in)

---

## Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

Ensure you have **Node.js** and **npm** installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### 2. Clone the Repository

Clone this repository to your local machine using your preferred method.

```bash
git clone [https://github.com/your-username/gemini-voice-clone.git](https://github.com/your-username/gemini-voice-clone.git)
cd gemini-voice-clone
```

### 3. Install Dependencies

Navigate to the project's root directory in your terminal and run the following command to install the necessary Node.js packages.

```bash
npm install
```

### 4. Set Up Environment Variables

You need a Google Gemini API key to run this application.

1.  Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).
2.  In the root of the project, create a new file named `.env`.
3.  Add your API key to the `.env` file as shown below:

```
# .env file
GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

### 5. Run the Server

Start the backend server with the following command:

```bash
npm start
```

You should see a confirmation message in your terminal: `Server is listening on port 3000`.

---

## Usage

1.  Open your web browser and navigate to **http://localhost:3000**.
2.  The browser will likely ask for permission to use your microphone. **You must click "Allow"**.
3.  Click the **"Start Talking"** button and begin speaking.
4.  Click the **"Stop & Process"** button when you are finished talking. The application will process your speech and the AI will respond.

---

## Project Structure

```
/gemini-voice-clone
|-- /public
|   |-- index.html         # Frontend UI
|   |-- style.css          # Styling
|   |-- client.js          # Client-side logic
|-- .env                   # API keys and environment variables
|-- package.json           # Project dependencies and scripts
|-- server.js              # Express server and backend logic
|-- README.md              # This file
```
