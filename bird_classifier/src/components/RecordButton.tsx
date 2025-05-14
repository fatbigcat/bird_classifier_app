"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Square } from "lucide-react";
import { cn } from "../lib/utils";
import { EdgeImpulseClassifier } from "../EdgeImpulseClassifier";
import BirdGallery from "./BirdGallery"; // Import the gallery component

export default function RecordButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Constants matching Edge Impulse configuration
  const SAMPLE_RATE = 48000; // 48kHz sample rate
  const WINDOW_SIZE = 48000; // 1 second window (48000 samples)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const classifierRef = useRef<EdgeImpulseClassifier | null>(null);
  const navigate = useNavigate();

  // Initialize Edge Impulse classifier
  useEffect(() => {
    const initClassifier = async () => {
      try {
        setError(null);

        if (typeof (window as any).Module === "undefined") {
          throw new Error("Edge Impulse Module not loaded. Please refresh the page.");
        }

        if (!classifierRef.current) {
          const classifier = new EdgeImpulseClassifier();
          classifierRef.current = classifier;
        }

        await classifierRef.current.init();
        console.log("Classifier initialized successfully");
        setIsInitializing(false);

        // Create AudioContext with required sample rate
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
        }
      } catch (err) {
        console.error("Failed to initialize classifier:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize audio processing.");
        setIsInitializing(false);
      }
    };

    initClassifier();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopRecording();

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);

      if (!classifierRef.current) {
        throw new Error("Classifier not initialized");
      }

      // Request microphone access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1, // Mono audio
          sampleRate: SAMPLE_RATE,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Handle incoming audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        processRecording();
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration and stop after 2 seconds (to ensure we get enough samples)
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 2) {
            stopRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setPermissionDenied(true);
        setError("Microphone access denied. Please allow microphone access to use this feature.");
      } else {
        setError("Could not access microphone. Please check your device settings.");
      }
    }
  };

  const stopRecording = () => {
    // Stop MediaRecorder if it's recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
  };

  const processRecording = async () => {
    try {
      if (!classifierRef.current) {
        throw new Error("Classifier not initialized");
      }

      if (audioChunksRef.current.length === 0) {
        throw new Error("No audio recorded");
      }

      // Create AudioContext if not exists
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
      }

      // Convert blob to array buffer
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // Validate sample rate
      if (audioBuffer.sampleRate !== SAMPLE_RATE) {
        throw new Error(`Invalid sample rate: ${audioBuffer.sampleRate}Hz. Required: ${SAMPLE_RATE}Hz`);
      }

      // Get raw audio data (first channel)
      const rawAudio = audioBuffer.getChannelData(0);

      // Ensure we have more than enough samples (we need exactly WINDOW_SIZE)
      if (rawAudio.length < WINDOW_SIZE) {
        throw new Error(`Recording too short - got ${rawAudio.length} samples, need exactly ${WINDOW_SIZE}`);
      }

      // Take exactly WINDOW_SIZE samples from the middle of the recording
      const midPoint = Math.floor(rawAudio.length / 2);
      const startIdx = Math.max(0, midPoint - Math.floor(WINDOW_SIZE / 2));
      const audioWindow = rawAudio.slice(startIdx, startIdx + WINDOW_SIZE);

      // Verify we got exactly WINDOW_SIZE samples
      if (audioWindow.length !== WINDOW_SIZE) {
        throw new Error(`Invalid sample count after windowing: ${audioWindow.length}. Required: ${WINDOW_SIZE}`);
      }

      // Create output array and normalize to [-1, 1]
      const normalizedAudio = new Float32Array(WINDOW_SIZE);
      let maxAmp = 0;

      // Find max amplitude
      for (let i = 0; i < audioWindow.length; i++) {
        maxAmp = Math.max(maxAmp, Math.abs(audioWindow[i]));
      }

      // Ensure we have some audio signal
      if (maxAmp < 0.01) {
        throw new Error("Audio signal too weak - please record in a quieter environment");
      }

      // Normalize to range [-1, 1]
      const scale = maxAmp > 0 ? 1.0 / maxAmp : 1.0;
      for (let i = 0; i < WINDOW_SIZE; i++) {
        normalizedAudio[i] = audioWindow[i] * scale;
      }

      // Final validation of sample count and range
      if (normalizedAudio.length !== WINDOW_SIZE) {
        throw new Error(`Final sample count invalid: ${normalizedAudio.length}`);
      }

      // Verify normalization
      for (let i = 0; i < normalizedAudio.length; i++) {
        if (Math.abs(normalizedAudio[i]) > 1) {
          throw new Error("Normalization failed - values outside [-1, 1] range");
        }
      }

      // Run classification with validated data
      const result = classifierRef.current.classify(normalizedAudio);
      console.log("Classification result:", result);

      // Validate the classification result
      if (!result || !Array.isArray(result.results)) {
        throw new Error("Invalid classification result format");
      }

      // Check if we have any predictions
      if (result.results.length === 0) {
        throw new Error("No bird classifications found");
      }

      // Check if any bird has a confidence > 0
      const hasValidPrediction = result.results.some(
        (prediction) => prediction.value > 0
      );
      if (!hasValidPrediction) {
        throw new Error("No birds could be identified from this recording");
      }

      // Store result directly - it's already in the correct format
      sessionStorage.setItem("birdRecognitionResult", JSON.stringify(result));
      navigate("/results");
    } catch (err) {
      console.error("Error processing recording:", err);
      setError(err instanceof Error ? err.message : "Error processing the recording. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={permissionDenied || isInitializing}
        className={cn(
          "relative w-24 h-24 rounded-full",
          "transition-colors duration-200",
          "flex items-center justify-center",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
          isRecording
            ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            : permissionDenied || isInitializing
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        )}
      >
        {isInitializing ? (
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isRecording ? (
          <Square className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}

        {isRecording && (
          <>
            <div className="absolute -inset-1 rounded-full border-4 border-red-500/30 animate-ping" />
            <div className="absolute -inset-4 rounded-full border-2 border-red-400/20 animate-ping animation-delay-300" />
            <div className="absolute -inset-8 rounded-full border border-red-400/30 animate-ping animation-delay-600" />
          </>
        )}
      </button>

      {isRecording && (
        <div className="mt-6 text-center">
          <div className="text-lg font-medium text-green-700 dark:text-green-400">Listening...</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{recordingDuration} seconds</div>
        </div>
      )}

      {!isRecording && !permissionDenied && (
        <div className="mt-6 text-center text-slate-600 dark:text-slate-400">
          {permissionDenied ? "Microphone access required" : "Tap to listen"}
        </div>
      )}

      {permissionDenied && (
        <div className="mt-4 text-center max-w-xs">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please enable microphone access in your browser settings to use this feature.
          </p>
        </div>
      )}

     {/* Add the Bird Gallery below the button and status messages */}
     <div className="mt-12 w-full max-w-4xl"> {/* Added margin-top and width constraints */}
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-4 text-center">
          Bird Library
        </h3>
        <BirdGallery />
      </div>
    </div>
  );
}
