import React from "react";
import TopNavbar from "../components/navbar/activeNavbar";
import SecondaryNavbar from "../components/navbar/secondaryNavbar";
import Footer from "../components/footer/footer";
import { Card, CardHeader, CardBody, CardFooter, Navbar } from "@nextui-org/react";

const FAQ = () => {
    return (
        <div>
            <TopNavbar />
            <SecondaryNavbar />
            <div className="container mx-auto p-4 space-y-4">
                <Card>
                    <CardHeader>
                    <h2>Contact Us</h2>
                    </CardHeader>
                    <CardBody>
                    <p>
                        If you have any questions about our legal documents or need
                        further clarification, please don't hesitate to contact us at:
                    </p>
                    <p>CardsClarity, Inc.</p>
                    <p>Email: cardsclarity@gmail.com</p>
                    <p>Phone: +1 (650) 4540709 - Dylan Bardsley (CEO)</p>
                    <p>Phone: +1 (347) 4706644 - Mark Leaf (CTO)</p>
                    <p>
                        We're committed to maintaining open communication with our users
                        and ensuring that our legal documentation is clear, accessible,
                        and compliant with all relevant laws and regulations.
                    </p>
                    </CardBody>
                    <CardFooter>
                    <p>Last updated: 08/23/2024</p>
                    </CardFooter>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default FAQ;