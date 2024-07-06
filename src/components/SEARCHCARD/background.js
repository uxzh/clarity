import React from "react";
import { useMediaQuery } from "usehooks-ts";

import ScrollingBanner from "./scrolling-banner";
import UserReview from "./user-review";

const testimonials = [
  {
    avatar: "https://picsum.photos/seed/user1/50/50",
    name: "TacoTuesday365",
    content:
      "The Chase Sapphire Preferred has been a game-changer for my travel rewards. The sign-up bonus alone covered my flight to Europe!",
  },
  {
    avatar: "https://picsum.photos/seed/user2/50/50",
    name: "MidnightCoder42",
    content:
      "I've been using the American Express Gold Card for a year now, and the rewards on dining and groceries are unbeatable. It's perfect for foodies like me!",
  },
  {
    avatar: "https://picsum.photos/seed/user3/50/50",
    name: "SunnyDayHiker",
    content:
      "The Capital One Venture card has simplified my travel planning. No blackout dates and easy-to-redeem miles make it my go-to for all trips.",
  },
  {
    avatar: "https://picsum.photos/seed/user4/50/50",
    name: "CoffeeLovinTeacher",
    content:
      "Discover it Cash Back has been fantastic for rotating categories. I've maximized my cashback on everything from gas to Amazon purchases!",
  },
  {
    avatar: "https://picsum.photos/seed/user5/50/50",
    name: "StargazerDreamer",
    content:
      "As a small business owner, the Ink Business Preferred has been invaluable. The bonus points on advertising and travel have really added up.",
  },
  {
    avatar: "https://picsum.photos/seed/user5/50/50",
    name: "poem_for_your_sprog",
    content:
      "As a small business owner, the Ink Business Preferred has been invaluable. The bonus points on advertising and travel have really added up.",
  },
  {
    avatar: "https://picsum.photos/seed/user6/50/50",
    name: "GallowBoob",
    content:
      "The Platinum Card from American Express is worth every penny of the annual fee. The lounge access alone has made my travel experiences so much more enjoyable.",
  },
  {
    avatar: "https://picsum.photos/seed/user7/50/50",
    name: "Warlizard",
    content:
      "I started with the Citi Double Cash card and it's been great for building credit. The flat 2% cashback on everything is so simple to use.",
  },
  {
    avatar: "https://picsum.photos/seed/user8/50/50",
    name: "Forthewolfx",
    content:
      "The Chase Trifecta (Sapphire Reserve, Freedom, and Freedom Unlimited) has maximized my point earnings. It takes some strategy, but the rewards are worth it!",
  },
  {
    avatar: "https://picsum.photos/seed/user9/50/50",
    name: "Vargas",
    content:
      "I love my Capital One QuickSilver card. The flat 1.5% cashback with no annual fee fits perfectly with my simple approach to credit card rewards.",
  },
  {
    avatar: "https://picsum.photos/seed/user10/50/50",
    name: "rogersimon10",
    content:
      "The transfer partners of the Chase Sapphire Reserve have allowed me to book first-class flights I never thought I could afford. It's changed how I travel!",
  },
  {
    avatar: "https://picsum.photos/seed/user11/50/50",
    name: "Trapped_in_There",
    content:
      "Hilton Honors American Express Surpass Card has upgraded my hotel stays significantly. The Gold status and bonus points on Hilton stays are unbeatable.",
  },
  {
    avatar: "https://picsum.photos/seed/user12/50/50",
    name: "AWildSketchAppeared",
    content:
      "The Citi / AAdvantage Platinum Select has been my secret weapon for scoring upgrades on American Airlines. The free checked bag benefit pays for the card itself!",
  },
  {
    avatar: "https://picsum.photos/seed/user13/50/50",
    name: "Blue_Watercolour",
    content:
      "I've been using the Blue Cash Preferred from American Express for all my grocery and streaming service purchases. The high cashback percentages really add up!",
  },
  {
    avatar: "https://picsum.photos/seed/user14/50/50",
    name: "StickleyMan",
    content:
      "The Chase Slate Edge has been crucial for my debt payoff strategy. The 0% intro APR period gave me the breathing room I needed to get my finances in order.",
  },
  {
    avatar: "https://picsum.photos/seed/user15/50/50",
    name: "_vargas_",
    content:
      "I can't say enough good things about the Chase Sapphire Reserve. Yes, the annual fee is high, but the travel credits, lounge access, and amazing travel insurance more than make up for it.",
  },
  {
    avatar: "https://picsum.photos/seed/user16/50/50",
    name: "way_fairer",
    content:
      "As a student, the Discover it Student Cash Back has been perfect. The good grades reward and cashback match for the first year have been a great boost to my finances.",
  },
  {
    avatar: "https://picsum.photos/seed/user17/50/50",
    name: "apostolate",
    content:
      "I use my Amazon Prime Rewards Visa Signature Card for all my Amazon and Whole Foods purchases. The 5% cashback has saved me so much over the past year!",
  },
  {
    avatar: "https://picsum.photos/seed/user18/50/50",
    name: "andrewsmith1986",
    content:
      "The Citi Diamond Preferred card's long 0% intro APR period on balance transfers was exactly what I needed to consolidate and pay off my credit card debt.",
  },
  {
    avatar: "https://picsum.photos/seed/user19/50/50",
    name: "karmanaut",
    content:
      "The United Explorer Card has enhanced my flights with free checked bags and priority boarding. Plus, the miles I've earned have funded several domestic trips!",
  },
];

/**
 *  This example requires installing the `usehooks-ts` package:
 * `npm install usehooks-ts`
 *
 * import {useMediaQuery} from "usehooks-ts";
 */
export default function Component() {
  const testimonials1 = testimonials.slice(0, 4);
  const testimonials2 = testimonials.slice(4, 8);
  const testimonials3 = testimonials.slice(8, 12);
  const testimonials4 = testimonials.slice(12, 16);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const firstColumn = React.useMemo(
    () => (isMobile ? testimonials : testimonials1),
    [isMobile, testimonials1]
  );

  return (
    <section className="mx-auto top-[-40vh] w-full max-w-6xl px-6 py-20 sm:py-32 lg:px-8 lg:py-40 absolute blur-0 opacity-40 z-0">
      <div className="columns-1 blur-sm sm:columns-2 md:columns-3 lg:columns-3">
        <ScrollingBanner
          isVertical
          duration={isMobile ? 200 : 120}
          shouldPauseOnHover={false}
        >
          {firstColumn.map((testimonial, index) => (
            <UserReview key={`${testimonial.name}-${index}`} {...testimonial} />
          ))}
        </ScrollingBanner>
        <ScrollingBanner
          isVertical
          className="hidden sm:flex"
          duration={80}
          shouldPauseOnHover={false}
        >
          {testimonials2.map((testimonial, index) => (
            <UserReview key={`${testimonial.name}-${index}`} {...testimonial} />
          ))}
        </ScrollingBanner>
        <ScrollingBanner
          isVertical
          className="hidden md:flex"
          duration={160}
          shouldPauseOnHover={false}
        >
          {testimonials3.map((testimonial, index) => (
            <UserReview key={`${testimonial.name}-${index}`} {...testimonial} />
          ))}
        </ScrollingBanner>
        <ScrollingBanner
          isVertical
          className="hidden lg:flex"
          duration={95}
          shouldPauseOnHover={false}
        >
          {testimonials4.map((testimonial, index) => (
            <UserReview key={`${testimonial.name}-${index}`} {...testimonial} />
          ))}
        </ScrollingBanner>
      </div>
    </section>
  );
}
