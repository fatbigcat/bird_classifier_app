"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Play, Info, MapPin, AlertCircle } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

// Define type for Bird data (matching BirdGallery and ResultsPage)
interface BirdData {
  name: string;
  scientificName: string;
  soundLabel: string;
  description: string;
  habitat: string;
  range: string;
  diet: string;
  recognitionCounter: number;
  imageUrl?: string;
  audioUrl?: string;
}

export default function BirdDetailsPage() {
  const [bird, setBird] = useState<BirdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    console.log("Location state:", location.state); // Log state for debugging
    if (
      location.state?.bird &&
      typeof location.state.bird === "object" &&
      location.state.bird.name
    ) {
      setBird(location.state.bird);
      setError(null); // Clear any previous error
    } else {
      // If no valid bird data is passed, set an error
      setError(
        "No bird details provided. Please select a bird from the gallery."
      );
      setBird(null); // Ensure bird state is null
    }
    setLoading(false); // Stop loading once state is checked
  }, [location.state]); // Re-run effect if location state changes

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-green-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-700 dark:text-slate-300">
            Loading bird details...
          </p>
        </div>
      </div>
    );
  }

  // --- Error State ---
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
                Could not load bird details
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {error ?? "An unknown error occurred."}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-colors"
              >
                <span>Back to Gallery</span>
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --- Success State (Bird Details) ---
  return (
    <div className="min-h-screen bg-gradient-green-blue">
      <div className="container mx-auto px-4 py-8">
        {/* Header: Back button and Bird Name as Title */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              to="/"
              className="p-2 mr-4 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-green-700 dark:text-green-400" />
              <span className="sr-only">Back to home</span>
            </Link>
            {/* Dynamic Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">
              {bird.name}
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="pb-16">
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Bird Image and Name Overlay */}
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
                  {/* Match % Removed */}
                </div>
              </div>
            </div>

            {/* Bird Details Content */}
            <div className="p-6">
              {/* Play Button */}
              {bird.audioUrl && (
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => {
                      if (bird.audioUrl) {
                        const audio = new Audio(bird.audioUrl);
                        audio
                          .play()
                          .catch((e) =>
                            console.error("Audio playback error:", e)
                          );
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Play Bird Call</span>
                  </button>
                </div>
              )}

              {/* About, Habitat, Range, Diet */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-green-600 dark:text-green-400" />{" "}
                    About
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {bird.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />{" "}
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
              {/* Other Possibilities Section Removed */}
            </div>
          </div>

          {/* Back to Gallery Button */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full shadow-md transition-colors"
            >
              <span>Back to Gallery</span>
            </Link>
          </div>
          {/* Identify Another Bird Button Removed */}
        </main>
      </div>
    </div>
  );
}
