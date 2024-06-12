import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/main";

import Wallet from "./pages/wallet";
import Rating from "./pages/rating";
import PageNotFound from "./pages/notFound";
import "./output.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
