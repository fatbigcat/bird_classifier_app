"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Info, MapPin, AlertCircle } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

// Bird data mapping
const birdDatabase: Record<string, any> = {
  "maliponirek": {
    scientificName: "Tachybaptus ruficollis",
    description: "The Little Grebe is a small water bird from the grebe family. It's one of the smallest members of its family and is known for its excellent diving abilities. In breeding plumage, it has a reddish neck, cheeks and flanks.",
    habitat: "Freshwater ponds, lakes, slow-moving rivers",
    range: "Europe, Asia, Africa",
    diet: "Small fish, aquatic insects, mollusks",
    imageUrl: "/little-grebe.png",
    audioUrl: "#",
  },
  "recnigaleb": {
    scientificName: "Chroicocephalus ridibundus",
    description: "The Black-headed Gull is a small gull that is most widely spread throughout Europe and Asia. During breeding season, it has a distinctive dark brown head (not actually black) with white eye-rings.",
    habitat: "Coastal areas, inland waters, urban areas",
    range: "Europe, Asia, parts of North America",
    diet: "Fish, insects, worms, scraps",
    imageUrl: "/black-headed-gull.png",
    audioUrl: "#",
  },
  "sivigaleb": {
    scientificName: "Larus argentatus",
    description: "The Herring Gull is a large gull species with silvery-grey back and wings, white head and underparts, and pink legs. It's one of the best known of all gulls along the coasts of Northern Europe.",
    habitat: "Coastal regions, harbors, urban areas",
    range: "Northern Europe, North America",
    diet: "Fish, marine invertebrates, carrion",
    imageUrl: "/herring-gull.png",
    audioUrl: "#",
  },
  "sum": {
    scientificName: "Bubo bubo",
    description: "The Eurasian Eagle-Owl is one of the largest owl species in the world. It has distinctive ear tufts, powerful talons, and striking orange eyes. Despite its size, it can move silently through the night.",
    habitat: "Forests, rocky areas, mountains",
    range: "Europe and Asia",
    diet: "Small mammals, other birds, amphibians",
    imageUrl: "/eagle-owl.png",
    audioUrl: "#",
  },
};

export default function ResultsPage() {
  const [recognitionResult, setRecognitionResult] =
    useState<EdgeImpulseResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get the recognition result from sessionStorage
    const storedResult = sessionStorage.getItem("birdRecognitionResult");
    console.log("Stored result:", storedResult);

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        console.log("Parsed result:", parsedResult);

        // Validate the parsed result structure
        if (!Array.isArray(parsedResult.results)) {
          throw new Error("Invalid classification result format");
        }

        // Check if we have any predictions
        if (parsedResult.results.length === 0) {
          throw new Error("No bird classifications found in the result");
        }

        // Check if any bird has a confidence > 0
        const hasValidPrediction = parsedResult.results.some(
          (result: { value: number }) => result.value > 0
        );
        if (!hasValidPrediction) {
          throw new Error("No confident predictions found");
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
      // If no result is found, redirect back to recording
      navigate("/");
    }

    setLoading(false);
  }, [navigate]);

  // Get the top bird prediction with additional validation
  const getTopBird = () => {
    if (!recognitionResult?.results) {
      console.log("No recognition results");
      return null;
    }

    console.log("Processing results:", recognitionResult.results);

    // Find the prediction with highest confidence
    const topPrediction = recognitionResult.results.reduce((top, current) => {
      return current.value > (top?.value || 0) ? current : top;
    }, recognitionResult.results[0]);

    if (!topPrediction) {
      console.log("No predictions found");
      return null;
    }

    console.log("Top prediction:", topPrediction);

    // Validate confidence threshold
    if (topPrediction.value < 0.1) {
      console.log("Top confidence too low:", topPrediction.value);
      return null;
    }

    // Look up bird details in database
    if (!birdDatabase[topPrediction.label]) {
      console.log("Bird not found in database:", topPrediction.label);
      return null;
    }

    return {
      name: topPrediction.label,
      confidence: Math.round(topPrediction.value * 100),
      ...birdDatabase[topPrediction.label],
    };
  };

  // Get other predictions for display
  const getOtherPredictions = () => {
    if (!recognitionResult?.results) return [];

    return recognitionResult.results
      .filter((result) => result.label !== getTopBird()?.name)
      .map((result) => ({
        name: result.label,
        confidence: Math.round(result.value * 100),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Get top 3 other predictions
  };

  const bird = getTopBird();
  const otherPredictions = getOtherPredictions();

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
                <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition-colors">
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
                    {otherPredictions.map((prediction) => (
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
