"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { ArrowLeft, Play, Info, MapPin, AlertCircle } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

const API_BASE_URL = "http://localhost:8000"; // Define API base URL

// Define types for our Edge Impulse response
interface EdgeImpulseResult {
  anomaly: number;
  results: Array<{
    label: string;
    value: number;
  }>;
}

// Define type for Bird data fetched from API
interface BirdData {
  name: string;
  scientificName: string;
  soundLabel: string;
  description: string;
  habitat: string;
  range: string; // Added range
  diet: string; // Added diet
  recognitionCounter: number;
  imageUrl?: string;
  audioUrl?: string;
  confidence?: number; // Optional confidence score
}

// Type for individual classification result
interface ClassificationResult {
    label: string;
    value: number;
}

export default function ResultsPage() {
  const [bird, setBird] = useState<BirdData | null>(null);
  const [rawResults, setRawResults] = useState<ClassificationResult[] | null>(null); // State for raw results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  useEffect(() => {
    const fetchBirdData = async (label: string, confidence?: number) => {
      try {
        const response = await fetch(`${API_BASE_URL}/birds/${label}`);
        if (!response.ok) {
          throw new Error(`Bird '${label}' not found in database`);
        }
        const birdData: Omit<BirdData, 'confidence'> = await response.json();
        setBird({ ...birdData, confidence }); // Add confidence if provided
      } catch (err) {
        console.error("Error fetching bird data:", err);
        setError(err instanceof Error ? err.message : "Could not fetch bird details");
      } finally {
        setLoading(false);
      }
    };

    // 1. Check location state (from gallery navigation)
    if (location.state?.bird) {
      console.log("Using bird data from location state:", location.state.bird);
      setBird(location.state.bird);
      setLoading(false);
      // Clear session storage if navigating from gallery
      sessionStorage.removeItem("birdRecognitionResult");
    } else {
      // 2. Check sessionStorage (from audio recognition)
      const storedResult = sessionStorage.getItem("birdRecognitionResult");
      console.log("Stored result:", storedResult);

      if (storedResult) {
        try {
          const parsedResult: EdgeImpulseResult = JSON.parse(storedResult);
          console.log("Parsed result:", parsedResult);

          if (!Array.isArray(parsedResult.results) || parsedResult.results.length === 0) {
            throw new Error("Invalid or empty classification results");
          }

          // Find the top prediction
          const topPrediction = parsedResult.results.reduce((top, current) => {
            return current.value > (top?.value || 0) ? current : top;
          }, parsedResult.results[0]);

          if (!topPrediction || topPrediction.value < 0.1) { // Use a threshold if needed
             throw new Error("No confident predictions found");
          }

          const confidence = Math.round(topPrediction.value * 100);
          setRawResults(parsedResult.results); // Store raw results
          // Fetch details from API using the label from the top prediction
          fetchBirdData(topPrediction.label, confidence);

        } catch (err) {
          console.error("Error processing result:", err);
          setError(err instanceof Error ? err.message : "Could not process recognition results");
          setLoading(false);
        }
      } else {
        // 3. No data found
        console.log("No bird data found in state or session storage.");
        setError("No bird identification data available.");
        setLoading(false);
        // Optional: Redirect after a delay or show error permanently
        // setTimeout(() => navigate("/"), 3000);
      }
    }
  }, [navigate, location.state]); // Depend on location.state

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

  // Get other predictions for display (using rawResults state)
  const getOtherPredictions = () => {
    // Use rawResults and check if bird (top bird) is set
    if (!rawResults || !bird) return [];

    return rawResults
      // Filter out the main identified bird
      .filter((result: ClassificationResult) => result.label !== bird.name)
      // Map to the desired format
      .map((result: ClassificationResult) => ({
        name: result.label,
        confidence: Math.round(result.value * 100),
      }))
      // Sort by confidence descending
      .sort((a: {confidence: number}, b: {confidence: number}) => b.confidence - a.confidence)
      // Take the top 3
      .slice(0, 3);
  };

  // Calculate otherPredictions only if rawResults are available
  const otherPredictions = rawResults ? getOtherPredictions() : [];

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
                  {/* Conditionally render confidence */}
                  {bird.confidence !== undefined && (
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {bird.confidence}% match
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Add audio playback functionality if audioUrl exists */}
              {bird.audioUrl && (
                 <div className="flex justify-center mb-6">
                   <button
                     onClick={() => {
                       if (bird.audioUrl) {
                         const audio = new Audio(bird.audioUrl);
                         audio.play().catch(e => console.error("Audio playback error:", e));
                       }
                     }}
                     className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-colors"
                   >
                     <Play className="w-5 h-5" />
                     <span>Play Bird Call</span>
                   </button>
                 </div>
              )}

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

              {/* Only show "Other Possibilities" if confidence exists (i.e., from recognition) */}
              {bird.confidence !== undefined && otherPredictions.length > 0 && (
                 <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                   <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">
                     Other Possibilities
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     {otherPredictions.map((prediction: { name: string; confidence: number }) => ( // Add type
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
                     ))}
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
        </main>
      </div>
    </div>
  );
}
