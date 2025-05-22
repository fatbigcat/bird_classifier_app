# Product Requirements Document: Goričko Bird ID

## 1. Introduction

Goričko Bird ID is a web application designed to identify bird species based on their songs or calls, similar in concept to Shazam but specialized for avian sounds. It utilizes a WebAssembly-powered model for client-side audio classification, ensuring fast processing and offline capability.

## 2. Goals

- Allow users to record bird sounds via their device microphone.
- Provide the most likely bird species identification based on the recording.
- Display the confidence level of the identification.
- Offer a simple, responsive, and intuitive user interface.
- Serve as a personal project or demonstration application.

## 3. Target Audience

- Bird enthusiasts
- Nature lovers
- Students or individuals interested in audio classification technology

## 4. Core Features (MVP - Vertical Slice 1)

This initial slice focuses on the core end-to-end functionality.

- **Frontend (React/Vite/Tailwind):**
  - A simple interface with a button to start/stop audio recording
  - Mechanism to capture audio using the browser's `navigator.mediaDevices.getUserMedia`
  - WebAssembly-based model initialization and runtime management
  - Direct audio input to WebAssembly module
  - Display area to show the classification result
  - Basic loading/status indicator during recording
  - Basic error handling display (e.g., microphone permission denied)
- **Backend (Express - minimal):**
  - Serve static assets and model files
  - Bird information API endpoints
  - Basic CORS (Cross-Origin Resource Sharing) configuration

## 5. Future Iterations (Potential Slices)

- **Slice 2: Enhanced Results Display:**
  - Show top N predictions instead of just the top one.
  - Display basic information about the identified bird (e.g., image, scientific name, brief description - potentially from a static data source initially).
- **Slice 3: History:**
  - Store recent identifications locally (e.g., `localStorage` or `sessionStorage`).
  - Display a list of past identifications on a separate history page.
- **Slice 4: UI/UX Improvements:**
  - More sophisticated recording UI (e.g., waveform visualization).
  - Improved loading states and animations.
  - Refined styling and layout using Tailwind.
- **Slice 5: Advanced Features (Optional):**
  - Geolocation integration to potentially improve accuracy based on local bird populations.
  - User accounts for saving history across devices.

## 6. Tech Stack

- **Frontend:**
  - Vite, React, TypeScript, Tailwind CSS
  - WebAssembly for model deployment
  - Web Audio API for audio processing
- **Backend:** Lightweight Express server for static assets and bird data
- **Model:** Edge Impulse-exported WebAssembly model for bird sound classification
- **Deployment:** (TBD - e.g., Vercel, Netlify, Heroku)

## 7. Architecture

- **Frontend:**
  - Single Page Application (SPA) handling user interaction and presentation
  - WebAssembly module for local model inference
  - Web Audio API for audio capture and processing
- **Backend:** Minimal server for serving static assets and bird information
- **Model:** WebAssembly-compiled model runs entirely in the browser

## 8. Implementation Approach

- **Vertical Slice:** Build the MVP (Slice 1) first, ensuring the core record -> process -> classify -> display loop works entirely in the browser
- **WebAssembly Integration:** Carefully manage model initialization and memory handling
- **LLM-Assisted:** Leverage LLM for code generation, explanation, debugging, and documentation

## 9. Non-Goals (Initially)

- User authentication/accounts
- Complex database integration for storing recordings
- Support for pre-recorded audio file uploads (focus on live recording first)
- Model training or fine-tuning (use pre-trained model initially)
