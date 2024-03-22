import React from "react";
import TopNavbar from "../components/navbar/topNavbar";
import Hero from "../sections/Hero";
import Focus from "../sections/Focus";
import Screenshot from "../sections/Screenshot";
import Footer from "../sections/Footer";
import { MouseFollowCaption } from "../components/ui/floatingCard";
import ScreenshotExplanation from "../components/ui/ScreenshotExplanation";
import BentoGrid from "../components/ui/BentoGrid";
import FinanceDashboard from "../components/ui/Dashboard";
import CardSpotlight from "../components/ui/MovingCards";
import Services from "../components/ui/Services";
import ByTheNumbers from "../components/ui/ByTheNumbers";

export default function Main() {
  return (
    <div id="app">
      <TopNavbar />
      <Hero />
      <Focus />
      <Services />
      <ByTheNumbers />
      <Footer />
    </div>
  );
}
