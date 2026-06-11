import { useState, useEffect } from "react";
import type { AgencyResponse } from "./types/api";
import { fetchAgencies } from "./services/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BuildingPage } from "./pages/BuildingPage";

export default function App() {
  const [agencies, setAgencies] = useState<AgencyResponse[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<AgencyResponse | null>(null);

  useEffect(() => {
    fetchAgencies()
      .then((data) => {
        setAgencies(data);
        if (data.length > 0) setSelectedAgency(data[0]);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        agencies={agencies}
        selectedAgency={selectedAgency}
        onSelectAgency={setSelectedAgency}
      />

      <div className="flex-1 pt-16">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage selectedAgency={selectedAgency} />}/>
            <Route path="/buildings/*" element={<BuildingPage />}/>
          </Routes>
        </BrowserRouter>
      </div>

      <Footer agencies={agencies} />
    </div>
  );
}
