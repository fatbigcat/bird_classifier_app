import Link from "next/link"
import Image from "next/image"
import { ArrowLeftIcon, PlayIcon, InfoIcon, MapPinIcon } from "lucide-react"

export default function ResultsPage() {
  // In a real app, this would come from API data based on the recognition
  const bird = {
    id: "demo",
    name: "American Robin",
    scientificName: "Turdus migratorius",
    description:
      "The American Robin is a migratory songbird of the true thrush genus and Turdidae, the wider thrush family. It is widely distributed throughout North America, wintering from southern Canada to central Mexico and along the Pacific Coast.",
    habitat: "Woodlands, gardens, parks, yards",
    range: "Throughout North America",
    diet: "Earthworms, insects, berries",
    confidence: 98,
    imageUrl: "/robin-foraging.png",
    audioUrl: "#", // In a real app, this would be a URL to the bird's call audio
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center mb-6">
          <Link
            href="/"
            className="p-2 mr-4 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-green-700 dark:text-green-400" />
            <span className="sr-only">Back to home</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">Identification Result</h1>
        </header>

        <main className="pb-16">
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64 md:h-80 w-full">
              <Image src={bird.imageUrl || "/placeholder.svg"} alt={bird.name} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{bird.name}</h2>
                    <p className="text-sm text-white/80 italic">{bird.scientificName}</p>
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
                  <PlayIcon className="w-5 h-5" />
                  <span>Play Bird Call</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <InfoIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    About
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">{bird.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Habitat & Range
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Habitat:</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">{bird.habitat}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Range:</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">{bird.range}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Diet:</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">{bird.diet}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full shadow-md transition-colors"
            >
              <span>Identify Another Bird</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
