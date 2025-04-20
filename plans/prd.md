# Product Requirements Document: BirdSong ID

## 1. Introduction

BirdSong ID is a web application designed to identify bird species based on their songs or calls, similar in concept to Shazam but specialized for avian sounds. It utilizes the Edge Impulse API for audio classification.

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
  - A simple interface with a button to start/stop audio recording.
  - Mechanism to capture audio using the browser's `navigator.mediaDevices.getUserMedia`.
  - Functionality to send the recorded audio data (e.g., as a Blob) to the backend API endpoint.
  - Display area to show the classification result (top predicted species and confidence score) received from the backend.
  - Basic loading/status indicator during recording and analysis.
  - Basic error handling display (e.g., microphone permission denied, API error).
- **Backend (Express):**
  - An API endpoint (e.g., `/api/classify`) to receive audio data from the frontend (using `multer` or similar for handling file/blob data).
  - Securely store and access the Edge Impulse API key and Project ID (using environment variables via `dotenv`).
  - Logic to forward the received audio data to the appropriate Edge Impulse classification API endpoint.
  - Handle the response from the Edge Impulse API.
  - Send a structured response back to the frontend containing the top prediction (species name) and confidence score, or an error message.
  - Implement basic CORS (Cross-Origin Resource Sharing) to allow requests from the frontend domain.

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

- **Frontend:** Vite, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **API:** Edge Impulse (for audio classification)
- **Deployment:** (TBD - e.g., Vercel, Netlify, Heroku)

## 7. Architecture

- **Frontend:** Single Page Application (SPA) handling user interaction and presentation.
- **Backend:** Acts as a secure proxy/intermediary between the frontend and the Edge Impulse API. It handles API key management and forwards requests.
- **External API:** Edge Impulse performs the core machine learning classification.

## 8. Implementation Approach

- **Vertical Slice:** Build the MVP (Slice 1) first, ensuring the core record -> send -> classify -> display loop works. Subsequent features will be added as separate slices.
- **LLM-Assisted:** Leverage LLM for code generation, explanation, debugging, and documentation, reviewing the existing codebase at each step to inform the next action.

## 9. Non-Goals (Initially)

- User authentication/accounts.
- Offline functionality.
- Real-time classification during recording.
- Complex database integration for storing recordings or user data.
- Support for pre-recorded audio file uploads (focus on live recording first).
