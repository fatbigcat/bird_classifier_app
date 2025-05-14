import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bird } from "lucide-react"; // Placeholder icon

const API_BASE_URL = "http://localhost:8000";

// Define type for Bird data fetched from API (matching ResultsPage)
interface BirdData {
  name: string;
  scientificName: string;
  soundLabel: string;
  description: string;
  habitat: string;
  range: string;
  diet: string;
  recognitionCounter: number;
  imageUrl?: string;
  audioUrl?: string;
}

export default function BirdGallery() {
  const [birds, setBirds] = useState<BirdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBirds = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/birds/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BirdData[] = await response.json();
        const filteredData = data.filter(bird => bird.name.toLowerCase() !== "sum");
        setBirds(filteredData);
        setError(null);
      } catch (err) {
        console.error("Error fetching birds:", err);
        setError(err instanceof Error ? err.message : "Failed to load bird gallery");
        setBirds([]); // Clear birds on error
      } finally {
        setLoading(false);
      }
    };

    fetchBirds();
  }, []);

  const handleBirdClick = (bird: BirdData) => {
    navigate("/bird-details", { state: { bird } });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 dark:text-slate-400">Loading bird gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        <p>Error loading bird gallery: {error}</p>
      </div>
    );
  }

  if (birds.length === 0) {
     return (
       <div className="text-center py-8">
         <p className="text-slate-600 dark:text-slate-400">No birds found in the database.</p>
       </div>
     );
   }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
      {birds.map((bird) => (
        <button
          key={bird.soundLabel}
          onClick={() => handleBirdClick(bird)}
          className="group bg-white/70 dark:bg-slate-800/70 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center aspect-square"
        >
          {/* Placeholder for image - replace with img tag if bird.imageUrl exists */}
          {bird.imageUrl ? (
             <img src={bird.imageUrl} alt={bird.name} className="w-16 h-16 object-contain mb-2 rounded-xl group-hover:scale-105 transition-transform" />
           ) : (
             <Bird className="w-12 h-12 text-green-600 dark:text-green-400 mb-2 group-hover:scale-105 transition-transform" />
           )}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
            {bird.name}
          </span>
        </button>
      ))}
    </div>
  );
}