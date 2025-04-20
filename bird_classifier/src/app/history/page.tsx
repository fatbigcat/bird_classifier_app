import { Link } from "react-router-dom";
import { ArrowLeftIcon, CalendarIcon, MapPinIcon } from "lucide-react";

const historyItems = [
  {
    id: 1,
    name: "American Robin",
    scientificName: "Turdus migratorius",
    date: "Today, 2:34 PM",
    location: "Central Park, NY",
    confidence: 98,
    imageUrl: "/robin-on-branch.png",
  },
  {
    id: 2,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    date: "Yesterday, 10:15 AM",
    location: "Backyard",
    confidence: 95,
    imageUrl: "/cardinal-on-snowy-branch.png",
  },
  {
    id: 3,
    name: "Blue Jay",
    scientificName: "Cyanocitta cristata",
    date: "Yesterday, 8:22 AM",
    location: "Riverside Park",
    confidence: 92,
    imageUrl: "/blue-jay-perched.png",
  },
  {
    id: 4,
    name: "House Sparrow",
    scientificName: "Passer domesticus",
    date: "Jun 12, 2023",
    location: "Downtown",
    confidence: 97,
    imageUrl: "/house-sparrow-perched.png",
  },
  {
    id: 5,
    name: "European Starling",
    scientificName: "Sturnus vulgaris",
    date: "Jun 10, 2023",
    location: "City Square",
    confidence: 91,
    imageUrl:
      "/placeholder.svg?height=80&width=80&query=european starling bird",
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center mb-8">
          <Link
            to="/"
            className="p-2 mr-4 rounded-full bg-white/80 dark:bg-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-green-700 dark:text-green-400" />
            <span className="sr-only">Back to home</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">
            Identification History
          </h1>
        </header>

        <main>
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg overflow-hidden">
            {historyItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  No identification history yet
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {historyItems.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <Link
                      to={`/bird/${item.id}`}
                      className="flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-medium text-slate-900 dark:text-slate-100">
                          {item.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                          {item.scientificName}
                        </p>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-2">
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                            {item.date}
                          </div>
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                            {item.location}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm font-medium text-green-600 dark:text-green-400 md:text-right">
                        {item.confidence}% match
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
