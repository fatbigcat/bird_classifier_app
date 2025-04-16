"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Info, MapPin, AlertCircle } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

// Define types for our Edge Impulse response
interface EdgeImpulseResult {
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

// Bird data mapping
const birdDatabase: Record<string, any> = {
  "American Robin": {
    scientificName: "Turdus migratorius",
    description:
      "The American Robin is a migratory songbird of the true thrush genus and Turdidae, the wider thrush family. It is widely distributed throughout North America, wintering from southern Canada to central Mexico and along the Pacific Coast.",
    habitat: "Woodlands, gardens, parks, yards",
    range: "Throughout North America",
    diet: "Earthworms, insects, berries",
    imageUrl: "/robin-foraging.png",
    audioUrl: "#", // In a real app, this would be a URL to the bird's call audio
  },
  "Northern Cardinal": {
    scientificName: "Cardinalis cardinalis",
    description:
      "The Northern Cardinal is a distinctive, medium-sized songbird with a bright red crest, body, and tail. Males are more vibrantly colored than females, which have a more brownish-red appearance with red accents.",
    habitat: "Gardens, shrublands, forest edges",
    range: "Eastern and Central United States, Mexico",
    diet: "Seeds, fruits, insects",
    imageUrl: "/cardinal-on-snowy-branch.png",
    audioUrl: "#",
  },
  "Blue Jay": {
    scientificName: "Cyanocitta cristata",
    description:
      "The Blue Jay is a passerine bird in the family Corvidae, native to eastern North America. It is resident through most of eastern and central United States and southern Canada.",
    habitat: "Forests, suburban areas, parks",
    range: "Eastern and Central North America",
    diet: "Nuts, seeds, insects, small vertebrates",
    imageUrl: "/blue-jay-perched.png",
    audioUrl: "#",
  },
  "House Sparrow": {
    scientificName: "Passer domesticus",
    description:
      "The House Sparrow is a small bird of the sparrow family Passeridae. It's one of the most widely distributed wild birds globally and is closely associated with human habitation.",
    habitat: "Urban and rural areas near human settlements",
    range: "Worldwide (introduced to many regions)",
    diet: "Seeds, grains, insects, food scraps",
    imageUrl: "/house-sparrow-perched.png",
    audioUrl: "#",
  },
  "European Starling": {
    scientificName: "Sturnus vulgaris",
    description:
      "The European Starling is a medium-sized passerine bird in the starling family. It is about 20 cm long and has glossy black plumage with a metallic sheen, which is speckled with white at some times of year.",
    habitat: "Urban areas, farmland, open woodlands",
    range: "Europe, Asia, North America (introduced)",
    diet: "Insects, fruits, seeds, human food waste",
    imageUrl: "/european-starling.png",
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

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setRecognitionResult(parsedResult);
      } catch (err) {
        console.error("Error parsing stored result:", err);
        setError("Could not load recognition results");
      }
    } else {
      // If no result is found, we'll use demo data for testing
      // In a real app, you might want to redirect back to the recording page
      setRecognitionResult({
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
      });
    }

    setLoading(false);
  }, [navigate]);

  // Get the top bird prediction
  const getTopBird = () => {
    if (!recognitionResult?.success) return null;

    const classifications = recognitionResult.result.classification;
    let topBirdName = "";
    let topConfidence = 0;

    Object.entries(classifications).forEach(([name, confidence]) => {
      if (confidence > topConfidence) {
        topBirdName = name;
        topConfidence = confidence;
      }
    });

    if (!topBirdName || !birdDatabase[topBirdName]) return null;

    return {
      name: topBirdName,
      confidence: Math.round(topConfidence * 100),
      ...birdDatabase[topBirdName],
    };
  };

  const bird = getTopBird();

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

  // Get other predictions for display
  const getOtherPredictions = () => {
    if (!recognitionResult?.success) return [];

    return Object.entries(recognitionResult.result.classification)
      .filter(([name]) => name !== bird.name)
      .map(([name, confidence]) => ({
        name,
        confidence: Math.round(confidence * 100),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Get top 3 other predictions
  };

  const otherPredictions = getOtherPredictions();

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
