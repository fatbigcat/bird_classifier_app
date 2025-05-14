import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ResultsPage from "./pages/ResultsPage"
import HistoryPage from "./pages/HistoryPage"
import AboutPage from "./pages/AboutPage"
import BirdDetailsPage from "./app/bird-details/page" // Import the new details page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/bird-details" element={<BirdDetailsPage />} /> {/* Add route for bird details */}
      </Routes>
    </Router>
  )
}

export default App
