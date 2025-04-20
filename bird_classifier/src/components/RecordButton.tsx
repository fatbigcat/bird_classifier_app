"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, StopCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface DemoResponse {
  success: boolean;
  result: {
    classification: Record<string, number>;
    timing: {
      dsp: number;
      classification: number;
      anomaly: number;
    };
  };
}

export default function RecordButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoResponse, setDemoResponse] = useState<DemoResponse | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // For development/testing
  const useDemoResponse = async (): Promise<DemoResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      success: true,
      result: {
        classification: {
          "American Robin": 0.98,
          "Northern Cardinal": 0.01,
          "Blue Jay": 0.005,
          "House Sparrow": 0.003,
          "European Starling": 0.002,
        },
        timing: {
          dsp: 15,
          classification: 28,
          anomaly: 0,
        },
      },
    };
  };

  useEffect(() => {
    let mounted = true;

    const fetchDemoResponse = async () => {
      const response = await useDemoResponse();
      if (mounted) {
        setDemoResponse(response);
      }
    };

    fetchDemoResponse();

    return () => {
      mounted = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create media recorder with optimized settings for Edge Impulse
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm", // Most compatible format
        audioBitsPerSecond: 128000, // 128kbps audio quality
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        processRecording();
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms for smoother streaming if needed
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => {
          // Auto-stop after 10 seconds
          if (prev >= 10) {
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
        setError(
          "Microphone access denied. Please allow microphone access to use this feature."
        );
      } else {
        setError(
          "Could not access microphone. Please check your device settings."
        );
      }
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();

      // Stop all audio tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
  };

  const processRecording = async () => {
    try {
      if (audioChunksRef.current.length === 0) {
        setError("No audio recorded. Please try again.");
        return;
      }

      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioBlob, "bird_sound.webm");

      // Use the backend API endpoint instead of calling Edge Impulse directly
      const response = await fetch("http://localhost:3000/api/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // For development, use demo response if API call fails
      const finalResult = response.ok ? result : demoResponse;
      sessionStorage.setItem(
        "birdRecognitionResult",
        JSON.stringify(finalResult)
      );

      navigate("/results");
    } catch (err) {
      console.error("Error processing recording:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error processing the recording. Please try again."
      );

      // Use demo response as fallback in development
      if (process.env.NODE_ENV === "development" && demoResponse) {
        sessionStorage.setItem(
          "birdRecognitionResult",
          JSON.stringify(demoResponse)
        );
        navigate("/results");
      }
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
        disabled={permissionDenied}
        className={cn(
          "relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center",
          "bg-green-600 hover:bg-green-700 active:bg-green-800 transition-all",
          "disabled:bg-slate-400 disabled:cursor-not-allowed",
          "shadow-lg hover:shadow-xl",
          isRecording && "animate-pulse"
        )}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <StopCircle className="w-12 h-12 md:w-16 md:h-16 text-white" />
        ) : (
          <Mic className="w-12 h-12 md:w-16 md:h-16 text-white" />
        )}

        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping" />
            <div className="absolute -inset-4 rounded-full border-2 border-green-400/50 animate-ping animation-delay-300" />
            <div className="absolute -inset-8 rounded-full border border-green-400/30 animate-ping animation-delay-600" />
          </>
        )}
      </button>

      {isRecording && (
        <div className="mt-6 text-center">
          <div className="text-lg font-medium text-green-700 dark:text-green-400">
            Listening...
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {recordingDuration} seconds
          </div>
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
            Please enable microphone access in your browser settings to use this
            feature.
          </p>
        </div>
      )}
    </div>
  );
}
