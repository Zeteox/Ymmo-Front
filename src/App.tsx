import { useState, useEffect, use } from "react";
import type { AgencyResponse } from "./types/api";
import { fetchAgencies } from "./services/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import { userApiService } from "./services/userApiService";

export default function App() {
  const [agencies, setAgencies] = useState<AgencyResponse[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<AgencyResponse | null>(null);

  useEffect(() => {
    const handleSetAgency = (agencies:AgencyResponse[]) => {
      if (localStorage.getItem("token")) {
        userApiService.getMe().then(user => {
          const agency = agencies.find(a => a.id === user.agencyId) ?? agencies[0];
          setSelectedAgency(agency);
        }).catch(e => console.error("erreur chargement agence " + e));
      } else {
        setSelectedAgency(agencies[0]);
      }
    }

    fetchAgencies()
      .then((data) => {
        setAgencies(data);
        if (data.length > 0) handleSetAgency(data);
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
            <Route path="/login" element={<AuthPage />}/>
            <Route path="/register" element={<AuthPage agencies={agencies} isRegister={true}/>}/>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </div>

      <Footer agencies={agencies} />
    </div>
  );
}
