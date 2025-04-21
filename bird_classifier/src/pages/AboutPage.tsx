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
              About BirdSong ID
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="max-w-3xl mx-auto">
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-48 md:h-64 w-full">
              <img
                src="https://www.park-goricko.org/data/galerija/5241ae68f451ed0e17941a5b1c619cbec313a42d/31604400403lesna_sova_m.jpg"
                alt="Birds in forest"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Our Mission
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                BirdSong ID was created to help bird enthusiasts, researchers,
                and nature lovers identify bird species by their songs and
                calls. Our mission is to make bird identification accessible to
                everyone and contribute to bird conservation through increased
                awareness and education.
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                How It Works
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Our app processes audio recordings by analyzing their frequency
                patterns and temporal features. These sound characteristics are
                then compared against a database of labeled bird songs using
                machine learning models. By leveraging spectrogram analysis and
                neural networks, we can classify bird species with precision,
                even in noisy environments.
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Privacy
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We respect your privacy. Audio recordings are only used for bird
                identification and are not stored on our servers unless you
                explicitly choose to save them. Location data is only used to
                improve identification accuracy by considering local bird
                populations.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
                  onClick={() =>
                    alert("Support This Project functionality coming soon!")
                  }
                >
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Support This Project</span>
                </button>
                <a
                  href="https://github.com/fatbigcat/bird_classifier_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>© 2025 Kalina Šušteršič, Sara Štrakl, Urška Krumpak </p>
          </div>
        </main>
      </div>
    </div>
  );
}
