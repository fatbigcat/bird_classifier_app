# Goričko Bird ID

A web application that identifies bird species from audio recordings using a machine learning model running in the browser. Users can record bird sounds and instantly receive identification results, including detailed information about the detected species.

## Features

- Record bird sounds directly in your browser
- Real-time bird species identification using a WebAssembly (Edge Impulse) model
- Detailed information about identified birds: habitat, range, description, and more
- Dark/light mode theme toggle
- Responsive design for desktop and mobile

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Git](https://git-scm.com/) (optional, for cloning the repository)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bird_classifier_app.git
cd bird_classifier_app
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd bird_classifier
npm install
```

## Running the Application

### 1. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Using the Application

1. Open your browser and go to `http://localhost:5173`
2. Click the record button to start recording bird sounds
3. Allow microphone access when prompted
4. Record the bird sound for a few seconds
5. Click the stop button to end recording
6. The app will process the recording and display the identification result
7. View detailed information about the identified bird species

## Project Structure

- `/bird_classifier` - Frontend React application (TypeScript, Vite, Tailwind CSS)
- `/public/static/audio` - Example bird audio files
- `/src/data/birds.ts` - Static bird information database
- `/src/components` - UI components (RecordButton, RecentRecognitions, etc.)
- `/src/EdgeImpulseClassifier.ts` - WebAssembly model integration

## Troubleshooting

- If you encounter microphone or permission issues, check your browser settings
- If the model fails to load, ensure the WASM files are present in `/public`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
