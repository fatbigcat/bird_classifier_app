# Birdsong ID

A web application that can identify bird species from audio recordings using machine learning. The app allows users to record bird sounds and get instant identification results with detailed information about the detected bird species.

## Features

- Record bird sounds directly from your browser
- Real-time bird species identification using Edge Impulse machine learning
- Detailed information about identified birds including habitat, range, and descriptions
- History of previous identifications
- Dark/light mode theme toggle
- Responsive design for both desktop and mobile devices

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Python](https://www.python.org/) (v3.8 or newer)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or newer)
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

### 3. Backend API Setup

Install Python dependencies for the backend API:

```bash
cd ../browser
pip install fastapi uvicorn pymongo pydantic
```

### 4. Database Setup

Make sure MongoDB is running on your local machine. Then set up the database:

```bash
cd ../db
pip install pymongo
python insert_birds.py
```

## Running the Application

### 1. Start MongoDB

Ensure MongoDB is running on your local machine (default port: 27017).

```bashmongod
# On macOS/Linux
mongod --dbpath=/path/to/your/data/directory

# On Windows
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe" --dbpath="C:\path\to\your\data\directory"
```

### 2. Start the Backend API

```bash
cd browser
python server.py
```

The backend API will be available at `http://localhost:8000`.

### 3. Start the Database API

```bash
cd db
uvicorn main:app --reload
```

The database API will be available at `http://localhost:8000`.

### 4. Start the Frontend Development Server

```bash
cd bird_classifier
npm run dev
```

The frontend development server will be available at `http://localhost:5173`.

## Using the Application

1. Open your browser and go to `http://localhost:5173`
2. Click on the record button to start recording bird sounds
3. Allow microphone access when prompted
4. Record the bird sound for a few seconds
5. Click the stop button to end recording
6. The application will process the recording and display the identification result
7. View detailed information about the identified bird species
8. Check the history page to see previous identifications

## Project Structure

- `/bird_classifier` - Frontend React application built with TypeScript, Vite, and Tailwind CSS
- `/browser` - Python API for audio processing
- `/db` - Database API and scripts for MongoDB integration

## Troubleshooting

- If you encounter CORS issues, make sure the backend API and frontend are running on the expected ports
- Check that MongoDB is running and accessible
- Ensure you have proper microphone permissions in your browser settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.
