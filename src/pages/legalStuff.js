import React from "react";
import TopNavbar from "../components/navbar/topNavbar";
import Footer from "../sections/Footer";
import { Card } from "@nextui-org/react";

const LegalStuff = () => {
  return (
    <div>
      <TopNavbar />
      <div className="container mx-auto p-4">
        <Card>
          <Card.Body>
            <h1>Legal Stuff</h1>
            <p>
              At CardsClarity, we believe in transparency and clarity, especially when it comes to legal matters. This page serves as a central hub for all our important legal documents. While we're in the process of developing comprehensive documentation, we want to provide you with an overview of the key legal aspects that govern our relationship with our users, partners, and visitors.
            </p>
            <h2>For Users</h2>
            <p>
              As a user of CardsClarity, the following documents are essential for understanding your rights and responsibilities:
            </p>
            <ul>
              <li>Terms of Service: This document outlines the rules and regulations for using our platform, including user responsibilities, content guidelines, and our service commitments.</li>
              <li>Privacy Policy: Our privacy policy details how we collect, use, and protect your personal information, ensuring compliance with data protection laws.</li>
              <li>Cookie Policy: This policy explains how we use cookies and similar technologies on our website, and how you can manage your preferences.</li>
              <li>Acceptable Use Policy: This document sets out the permitted uses and prohibited activities when using our platform.</li>
            </ul>
            <h2>For Partners</h2>
            <p>
              If you're considering a partnership with CardsClarity, these documents will be relevant:
            </p>
            <ul>
              <li>Partner Agreement: This agreement outlines the terms and conditions for our various partnership programs.</li>
              <li>Affiliate Program Terms: If you're interested in our affiliate program, this document details the rules and compensation structure.</li>
            </ul>
            <h2>For Everyone</h2>
            <p>
              These documents apply to all visitors of our website and users of our services:
            </p>
            <ul>
              <li>Website Terms of Use: This document governs your use of our website, regardless of whether you're a registered user.</li>
              <li>Intellectual Property Rights: Information about our trademarks, copyrights, and how you can use our brand assets.</li>
              <li>Accessibility Statement: Our commitment to making our website and services accessible to all users.</li>
            </ul>
            <h2>Data Privacy and Security</h2>
            <p>
              At CardsClarity, we take data privacy and security seriously. While we're finalizing our comprehensive documentation, please know that we adhere to industry-standard practices for data protection, including:
            </p>
            <ul>
              <li>Implementing robust security measures to protect user data</li>
              <li>Complying with relevant data protection regulations</li>
              <li>Providing transparency about our data collection and use practices</li>
              <li>Offering users control over their personal information</li>
            </ul>
            <h2>Future Updates</h2>
            <p>
              We're continuously working on improving and expanding our legal documentation to provide you with the most comprehensive and up-to-date information. As we develop new documents or make significant changes to existing ones, we'll update this page and notify our users accordingly.
            </p>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our legal documents or need further clarification, please don't hesitate to contact us at:
            </p>
            <p>
              CardsClarity, Inc.
            </p>
            <p>
              Email: cardsclarity@gmail.com
            </p>
            <p>
              Phone: +1 (650) 4540709 - Dylan Bardsley (CEO)
            </p>
            <p>
              Phone: +1 (347) 4706644 - Mark Leaf (CTO)
            </p>
            <p>
              We're committed to maintaining open communication with our users and ensuring that our legal documentation is clear, accessible, and compliant with all relevant laws and regulations.
            </p>
            <p>
              Last updated: 08/23/2024
            </p>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default LegalStuff;
