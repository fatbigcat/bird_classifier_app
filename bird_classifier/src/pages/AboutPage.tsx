import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Github } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-green-blue">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="p-2 mr-4 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-green-700 dark:text-green-400" />
              <span className="sr-only">Back to home</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">
              About Goričko Bird ID
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="max-w-3xl mx-auto">
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-48 md:h-64 w-full">
              <img
                src="https://www.park-goricko.org/data/galerija/5241ae68f451ed0e17941a5b1c619cbec313a42d/31604400403lesna_sova_m.jpg"
                alt="Birds in Goričko Nature Park"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Discover the Birds of Goričko
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                <strong>Goričko Bird ID</strong> is a web application dedicated to helping you identify the diverse bird species found in Goričko Nature Park. Whether you're a local resident, a visitor, or a nature enthusiast, our app makes it easy to recognize birds by their songs and calls using your device's microphone.
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Why Goričko?
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Goričko Nature Park is one of Slovenia's most important biodiversity hotspots, home to over 200 bird species. Many of these birds are rare or protected, making the park a vital area for conservation and birdwatching. Our app is designed to support local awareness and appreciation of this unique natural heritage.
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                How It Works
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Simply record a bird sound in the park or your backyard, and Goričko Bird ID will analyze the audio using advanced machine learning models. The app compares your recording to a curated database of local bird songs, providing you with the most likely species match and detailed information about each bird.
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Our Mission
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Our mission is to make bird identification accessible to everyone in Goričko and beyond, fostering a deeper connection with nature and supporting conservation efforts through education and engagement.
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>© 2025 Kalina Šušteršič, Sara Štrakl, Urška Krumpak</p>
          </div>
        </main>
      </div>
    </div>
  );
}
