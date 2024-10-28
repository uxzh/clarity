import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Wallet from "./pages/wallet";
import Rating from "./pages/rating";

import PageNotFound from "./pages/notFound";
import Review from "./pages/cardPage";
import ReviewSearch from "./pages/searchForCard";

import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Review />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/review" element={<ReviewSearch />} />
            <Route path="/rating" element={<Rating />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
