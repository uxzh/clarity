import React from "react";
import TopNavbar from "../components/navbar/activeNavbar";
import SecondaryNavbar from "../components/navbar/secondaryNavbar";
import Footer from "../components/footer/footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Overview = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      trasition={{ duration: 0.3 }}
    >
    <div>
      <TopNavbar />
      <SecondaryNavbar />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Legal Overview</h1>
        <p className="text-center text-gray-600">
          Learn about our policies and how we protect your privacy and security.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Privacy Policy */}
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-3">
              🔒
            </div>
            <h2 className="text-xl font-semibold">Privacy Policy</h2>
            <p className="text-gray-600">
              Explains what information we collect, how we use it, and how to review and update it.
            </p>
            <Link to="/privacy-policy" className="text-blue-500 hover:underline">
              Read our Privacy Policy →
            </Link>
          </div>

          {/* Terms of Service */}
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-3">
              📜
            </div>
            <h2 className="text-xl font-semibold">Terms of Service</h2>
            <p className="text-gray-600">
              Describes the rules you agree to when using our services.
            </p>
            <Link to="/tos" className="text-blue-500 hover:underline">
              Read our Terms of Service →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </motion.div>
  );
};

export default Overview;
