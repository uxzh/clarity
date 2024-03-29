import React from "react";
import TopNavbar from "../components/navbar/topNavbar";
import Hero from "../sections/Hero";
import Focus from "../sections/Focus";
import Footer from "../sections/Footer";
import Services from "../components/ui/Services";
import ByTheNumbers from "../components/ui/ByTheNumbers";
import FAQ from "../components/ui/FAQ";
import ExplanationHero from "./../sections/ExplanationHero";
import ExplainBlocks from "../sections/ExplainBlocks";

export default function Main() {
  return (
    <div id="app">
      <TopNavbar />
      <Hero />
      <ExplanationHero />
      <Focus />
      <ExplainBlocks />
      <Services />
      <ByTheNumbers />
      <FAQ />
      <Footer />
    </div>
  );
}
