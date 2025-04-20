import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const recentBirds = [
  {
    id: 1,
    name: "American Robin",
    scientificName: "Turdus migratorius",
    time: "Today, 2:34 PM",
    confidence: 98,
    imageUrl: "/robin-on-branch.png",
  },
  {
    id: 2,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    time: "Yesterday, 10:15 AM",
    confidence: 95,
    imageUrl: "/cardinal-on-snowy-branch.png",
  },
  {
    id: 3,
    name: "Blue Jay",
    scientificName: "Cyanocitta cristata",
    time: "Yesterday, 8:22 AM",
    confidence: 92,
    imageUrl: "/blue-jay-perched.png",
  },
];

export default function RecentRecognitions() {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-md overflow-hidden">
      {recentBirds.length === 0 ? (
        <div className="p-6 text-center text-slate-500 dark:text-slate-400">
          No recent identifications
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {recentBirds.map((bird) => (
            <li
              key={bird.id}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Link to={`/bird/${bird.id}`} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                  <img
                    src={bird.imageUrl || "/placeholder.svg"}
                    alt={bird.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-medium text-slate-900 dark:text-slate-100 truncate">
                    {bird.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    {bird.scientificName}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {bird.time}
                    </span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {bird.confidence}% match
                    </span>
                  </div>
                </div>

                <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <Play className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span className="sr-only">Play sound</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
