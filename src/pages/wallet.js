import React from "react";
// import Rating from "../components/RATING/rating";
import Rating from "./review";
import Navbar from "../components/navbar/activeNavbar";

export default function Review() {
  return (
    <React.Fragment>
      <Navbar />
      <Rating />
    </React.Fragment>
  );
}
