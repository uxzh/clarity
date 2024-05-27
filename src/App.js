import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/main";

import Review from "./pages/review";
import PageNotFound from "./pages/notFound";
import "./output.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/review" element={<Review />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
