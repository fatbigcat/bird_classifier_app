import Link from "next/link"
import Image from "next/image"
import { ArrowLeftIcon, HeartIcon, GithubIcon, TwitterIcon } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center mb-8">
          <Link
            href="/"
            className="p-2 mr-4 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-green-700 dark:text-green-400" />
            <span className="sr-only">Back to home</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">About BirdSong ID</h1>
        </header>

        <main className="max-w-3xl mx-auto">
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-48 md:h-64 w-full">
              <Image
                src="/placeholder.svg?height=300&width=800&query=diverse birds in forest canopy panorama"
                alt="Birds in forest"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                BirdSong ID was created to help bird enthusiasts, researchers, and nature lovers identify bird species
                by their songs and calls. Our mission is to make bird identification accessible to everyone and
                contribute to bird conservation through increased awareness and education.
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">How It Works</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Our app uses advanced audio recognition technology to identify bird species from their songs and calls.
                The recognition algorithm has been trained on thousands of bird sound recordings from around the world,
                allowing it to identify hundreds of different species with high accuracy.
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Privacy</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We respect your privacy. Audio recordings are only used for bird identification and are not stored on
                our servers unless you explicitly choose to save them. Location data is only used to improve
                identification accuracy by considering local bird populations.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
                >
                  <HeartIcon className="w-5 h-5 text-red-500" />
                  <span>Support This Project</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
                >
                  <GithubIcon className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
                >
                  <TwitterIcon className="w-5 h-5 text-blue-400" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>© 2023 BirdSong ID. All rights reserved.</p>
            <p className="mt-1">Made with ❤️ for bird lovers everywhere</p>
          </div>
        </main>
      </div>
    </div>
  )
}
