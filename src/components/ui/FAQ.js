import React from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Link,
  Spacer,
} from "@nextui-org/react";
import "../../CSS/FAQ.css";

export default function FAQ() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        marginTop: "8vh",
      }}
    >
      <h2 className="uppercase text-slate-800 color text-2xl font-black w-full text-center mb-4">
        you ask - we answer!
      </h2>{" "}
      <Accordion variant="bordered" id="faq-accordion">
        <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
          {defaultContent}
        </AccordionItem>
        <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
          {defaultContent}
        </AccordionItem>
        <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
          {defaultContent}
        </AccordionItem>
      </Accordion>
      <Spacer y={8} />
      <p className="text-center">Still have any questions?</p>
      <Spacer y={2} />
      <div style={{ textAlign: "center" }}>
        <Button
          as={Link}
          // href="https://forms.gle/kcRvqnSBm1XSQVfa7"
          target="__blank"
          className="shadow-[0px_3px_0px_0px_#1a202c]"
          style={{ border: "2px solid #1a202c", margin: "0 auto" }}
          variant="bordered"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
}
