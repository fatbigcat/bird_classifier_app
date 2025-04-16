import Link from "next/link"
import { HistoryIcon, InfoIcon } from "lucide-react"
import RecordButton from "@/components/record-button"
import RecentRecognitions from "@/components/recent-recognitions"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">BirdSong ID</h1>
          <nav className="flex gap-4">
            <Link
              href="/history"
              className="p-2 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <HistoryIcon className="w-5 h-5 text-green-700 dark:text-green-400" />
              <span className="sr-only">History</span>
            </Link>
            <Link
              href="/about"
              className="p-2 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <InfoIcon className="w-5 h-5 text-green-700 dark:text-green-400" />
              <span className="sr-only">About</span>
            </Link>
          </nav>
        </header>

        <main className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md mx-auto text-center mb-8">
            <h2 className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200 mb-4">
              Identify any bird by its song
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Tap the button and hold near a bird sound to identify the species
            </p>
          </div>

          <div className="mb-16 flex justify-center">
            <RecordButton />
          </div>

          <div className="w-full max-w-lg">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-4">Recent Identifications</h3>
            <RecentRecognitions />
          </div>
        </main>
      </div>
    </div>
  )
}
