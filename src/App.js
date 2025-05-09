import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AdminPanel from "./pages/adminPanel";
import Wallet from "./pages/wallet";
import PageNotFound from "./pages/notFound";
import Review from "./pages/cardPage";
import ReviewSearch from "./pages/searchForCard";
import LegalStuff from "./pages/legalStuff";
import PrivacyPolicy from "./pages/privacyPolicy";
import Overview from "./pages/overview";
import FAQ from "./pages/faq";

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
            <Route path="/rating" element={<Navigate to="/" />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/tos" element={<LegalStuff />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
