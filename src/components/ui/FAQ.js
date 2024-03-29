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
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        marginTop: "8vh",
        width: "95vw",
      }}
    >
      <h2 className="uppercase text-slate-800 color text-2xl font-black w-full text-center mb-4">
        you ask - we answer!
      </h2>
      <Accordion
        defaultExpandedKeys={["1"]}
        variant="bordered"
        id="faq-accordion"
      >
        <AccordionItem
          style={{ padding: "4px 0" }}
          key="1"
          title="How does Clarity help me earn more cashback?"
        >
          Clarity simplifies the process of earning cashback. We show you which
          of your credit cards will give you the highest cashback for your
          purchases, and we suggest new cards that could boost your rewards even
          further.
        </AccordionItem>
        <AccordionItem
          style={{ padding: "4px 0" }}
          key="2"
          title="Do I need to understand complex algorithms to use Clarity?"
        >
          No complex algorithms here! We focus on providing straightforward,
          actionable advice so you can easily maximize your cashback rewards.
        </AccordionItem>
        <AccordionItem
          style={{ padding: "4px 0" }}
          key="3"
          title="Is Clarity suitable for people who aren't tech-savvy?"
        >
          Yes, Clarity is designed to be user-friendly for everyone. Our
          platform is intuitive, making it simple to start earning more cashback
          right away.
        </AccordionItem>
        <AccordionItem
          style={{ padding: "4px 0" }}
          key="4"
          title="Will Clarity recommend credit cards that I don't need?"
        >
          We aim to recommend cards that will genuinely improve your cashback
          earnings, without overwhelming you with unnecessary options.
        </AccordionItem>
        <AccordionItem
          style={{ padding: "4px 0" }}
          key="5"
          title="How does Clarity remain unbiased in its recommendations?"
        >
          Clarity is not affiliated with any credit card companies, ensuring our
          recommendations are based solely on what's best for your cashback
          strategy.
        </AccordionItem>
        <AccordionItem
          style={{ padding: "4px 0" }}
          key="6"
          title="Can Clarity help me if I'm new to credit cards?"
        >
          Absolutely! Clarity is a great tool for both new and experienced
          credit card users to maximize their rewards.
        </AccordionItem>
        <AccordionItem
          style={{ padding: "4px 0" }}
          key="7"
          title="What about the security of my credit card information?"
        >
          We prioritize your security with industry-standard encryption to
          protect your data and never store sensitive credit card details.
        </AccordionItem>
        <AccordionItem
          style={{ padding: "4px 0" }}
          key="8"
          title="How do I get started with Clarity?"
        >
          Sign up on our website for the beta test, once approved, add your
          credit cards, and we'll show you how to get the most cashback from
          your spending.
        </AccordionItem>
      </Accordion>
      <Spacer y={8} />
      <p className="text-center">Still have any questions?</p>
      <Spacer y={2} />
      <div style={{ textAlign: "center" }}>
        <Button
          as={Link}
          href="mailto:cardsclarity@gmail.com"
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
