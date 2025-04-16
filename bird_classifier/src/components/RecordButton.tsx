import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mic } from "lucide-react"
import { cn } from "../lib/utils"

export default function RecordButton() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const navigate = useNavigate()

  const startRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)

    // In a real app, this is where you would start the actual audio recording
    // and connect to a backend service for bird sound recognition

    const interval = setInterval(() => {
      setRecordingDuration((prev) => {
        if (prev >= 10) {
          clearInterval(interval)
          setIsRecording(false)
          // Navigate to results page after recording
          navigate("/results?demo=true")
          return 0
        }
        return prev + 1
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className={cn(
          "relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center",
          "bg-green-600 hover:bg-green-700 active:bg-green-800 transition-all",
          "disabled:bg-green-700 disabled:cursor-not-allowed",
          "shadow-lg hover:shadow-xl",
          isRecording && "animate-pulse",
        )}
      >
        <Mic className="w-12 h-12 md:w-16 md:h-16 text-white" />

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
          <div className="text-lg font-medium text-green-700 dark:text-green-400">Listening...</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{recordingDuration} seconds</div>
        </div>
      )}

      {!isRecording && <div className="mt-6 text-center text-slate-600 dark:text-slate-400">Tap to listen</div>}
    </div>
  )
}
