"use client";

import { useState, useEffect, useRef } from "react";

// Define the EdgeImpulseResult type
type EdgeImpulseResult = {
  results: { label: string; value: number }[];
};
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Info, MapPin, AlertCircle } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { BIRDS_DATA } from "../data/birds";

export default function ResultsPage() {
  const [recognitionResult, setRecognitionResult] =
    useState<EdgeImpulseResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [birdData, setBirdData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("birdRecognitionResult");
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        if (!Array.isArray(parsedResult.results))
          throw new Error("Invalid classification result format");
        if (parsedResult.results.length === 0)
          throw new Error("No bird classifications found in the result");

        const topPrediction = parsedResult.results.reduce(
          (top: any, current: any) =>
            current.value > (top?.value || 0) ? current : top,
          parsedResult.results[0]
        );

        if (topPrediction?.value > 0.1) {
          const label = topPrediction.label;

          if (label === "sum") {
            setBirdData({
              confidence: Math.round(topPrediction.value * 100),
              ...BIRDS_DATA["sum"],
            });
            setLoading(false);
            return;
          }

          // Get the bird data from our static object
          const birdData = BIRDS_DATA[label];

          if (birdData) {
            setBirdData({
              confidence: Math.round(topPrediction.value * 100),
              ...birdData,
            });
          } else {
            console.error(`Bird with label '${label}' not found in data`);
            setError("Could not fetch bird details");
          }

          setLoading(false);
        }

        setRecognitionResult(parsedResult);
      } catch (err) {
        console.error("Error processing result:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not process the recognition results"
        );
      }
    } else {
      navigate("/");
    }
    setLoading(false);
  }, [navigate]);

  const bird = birdData;
  const otherPredictions =
    recognitionResult?.results
      ?.filter((result) => result.label !== bird?.name)
      .map((result) => ({
        name: result.label,
        confidence: Math.round(result.value * 100),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-green-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-700 dark:text-slate-300">
            Analyzing bird sound...
          </p>
        </div>
      </div>
    );
  }

  if (error || !bird) {
    return (
      <div className="min-h-screen bg-gradient-green-blue">
        <div className="container mx-auto px-4 py-8">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link
                to="/"
                className="p-2 mr-4 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-green-700 dark:text-green-400" />
                <span className="sr-only">Back to home</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">
                Error
              </h1>
            </div>
            <ThemeToggle />
          </header>
          <main className="pb-16">
            <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg overflow-hidden mb-8 p-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Could not identify bird
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {error ||
                  "We couldn't identify the bird from this recording. Please try again with a clearer recording."}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-colors"
              >
                <span>Try Again</span>
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-green-blue">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              to="/"
              className="p-2 mr-4 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-green-700 dark:text-green-400" />
              <span className="sr-only">Back to home</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">
              Identification Result
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="pb-16">
          {bird.name === "sum" ? (
            <div className="p-6 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                No bird detected
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                The sound you recorded was classified as background noise or
                unrelated to any known bird species.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-colors"
                >
                  <span>Try Again</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="relative h-64 md:h-80 w-full">
                  <img
                    src={bird.imageUrl || "/placeholder.svg"}
                    alt={bird.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                          {bird.name}
                        </h2>
                        <p className="text-sm text-white/80 italic">
                          {bird.scientificName}
                        </p>
                      </div>
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {bird.confidence}% match
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-6">
                    <audio
                      ref={audioRef}
                      src={bird.audioUrl}
                      className="hidden"
                    />
                    <button
                      onClick={() => {
                        audioRef.current?.play();
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      <span>Play Bird Call</span>
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-green-600 dark:text-green-400" />
                        About
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {bird.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Habitat & Range
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Habitat:
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                            {bird.habitat}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Range:
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                            {bird.range}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Diet:
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                            {bird.diet}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {otherPredictions.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">
                        Other Possibilities
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {otherPredictions.map(
                          (prediction: {
                            name: string;
                            confidence: number;
                          }) => (
                            <div
                              key={prediction.name}
                              className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3 flex justify-between items-center"
                            >
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {prediction.name}
                              </span>
                              <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full">
                                {prediction.confidence}%
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full shadow-md transition-colors"
                >
                  <span>Identify Another Bird</span>
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
