import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddBug from "./pages/AddBug";
import StatsPage from "./pages/StatsPage";
import BugDetails from "./pages/BugDetails";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddBug />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/bug/:id" element={<BugDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
