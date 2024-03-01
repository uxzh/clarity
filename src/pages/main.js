import React from "react";
import TopNavbar from "../components/navbar/topNavbar";
import Hero from "../sections/Hero";
import Focus from "../sections/Focus";
import Screenshot from "../sections/Screenshot";
import Footer from "../sections/Footer";
import { MouseFollowCaption } from "../components/ui/floatingCard";

export default function Main() {
  return (
    <div class="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]">
      <TopNavbar />
      <Hero />
      <Focus />
      {/* <Screenshot /> */}
      <MouseFollowCaption />
      <Footer />
    </div>
  );
}
