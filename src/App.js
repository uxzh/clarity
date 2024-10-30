import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPanel from "./pages/adminPanel";
import Wallet from "./pages/wallet";
import Rating from "./pages/rating";
import PageNotFound from "./pages/notFound";
import Review from "./pages/cardPage";
import ReviewSearch from "./pages/searchForCard";
import LegalStuff from "./pages/legalStuff";
import PrivacyPolicy from "./pages/privacyPolicy";

import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ReviewSearch />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/review" element={<Review />} />
            <Route path="/rating" element={<Rating />} />
            <Route path="/legal-stuff" element={<LegalStuff />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
