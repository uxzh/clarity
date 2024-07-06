"use client";

import React from "react";
import { Button, Link, Spacer } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { ReactComponent as Logo } from "../../lib/logo2.svg";
import { IconBug } from "@tabler/icons-react";

import { AcmeIcon } from "./social";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  //   {
  //     name: "About",
  //     href: "#",
  //   },
  {
    name: "Legal Stuff",
    href: "#",
  },
  {
    name: "Privacy Policy",
    href: "#",
  },
  {
    name: "Contact",
    href: "mailto:cardsclarity@gmail.com",
  },
  //   {
  //     name: "Blog",
  //     href: "#",
  //   },
  //   {
  //     name: "Careers",
  //     href: "#",
  //   },
];

const socialItems = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/people/CardsClarity/61561529222640/",
    icon: (props) => <Icon {...props} icon="fontisto:facebook" />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/cardsclarity/",
    icon: (props) => <Icon {...props} icon="fontisto:instagram" />,
  },
  {
    name: "Twitter",
    href: "https://www.x.com/cardsclarity",
    icon: (props) => <Icon {...props} icon="fontisto:twitter" />,
  },
  //   {
  //     name: "GitHub",
  //     href: "#",
  //     icon: (props) => <Icon {...props} icon="fontisto:github" />,
  //   },
  //   {
  //     name: "YouTube",
  //     href: "#",
  //     icon: (props) => <Icon {...props} icon="fontisto:youtube" />,
  //   },
];

export default function Component() {
  return (
    <footer className="flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-800">Cards</span>
          <Logo style={{ width: 48, height: "auto", margin: "0 8px" }} />
          <span className="text-lg font-semibold text-gray-800">Clarity</span>
        </div>
        <Spacer y={4} />
        <div className="flex justify-center gap-x-4">
          {socialItems.map((item) => (
            <Link
              key={item.name}
              isExternal
              className="text-default-400"
              href={item.href}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="w-5" />
            </Link>
          ))}
        </div>
        <Spacer y={4} />

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              isExternal
              className="text-default-500"
              href={item.href}
              size="sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
        {/* <Spacer y={6} /> */}

        <p className="mt-1 text-center text-small text-default-400">
          &copy; {new Date().getFullYear()} CardsClarity Inc. All rights
          reserved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        <Button
          isExternal
          className="text-default-500 bg-white text-black font-bold"
          href="mailto:bugs@cardsclarity.com"
          size="sm"
          onClick={() =>
            window.open(
              "mailto:cardsclarity@gmail.com?subject=CardsClarity Bug Report"
            )
          }
          startContent={<IconBug stroke={2} />}
        >
          Report a Bug
        </Button>
      </div>
      <Spacer y={4}></Spacer>
    </footer>
  );
}
