import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Badge,
} from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { ReactComponent as Clarity } from "../../lib/logo2.svg";
import MobileMenu from "./mobileMenu";
import SignUpModal from "../ui/signing/SignUpModal";

export default function ActiveNavbar() {
  const location = useLocation();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const getLinkStyles = (path) => {
    if (location.pathname === path) {
      return "text-black font-extrabold";
    }
    return "text-foreground";
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  return (
    <>
      <Navbar className="sm:mb-2 lg:mb-[8rem] sm:flex" isBlurred={false}>
        <NavbarContent>
          <NavbarBrand href="/" as={Link} className="max-h-7">
            <Clarity style={{ width: 48, marginRight: 4, maxHeight: 30 }} />
            <p className="font-extrabold text-black text-inherit">Clarity</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          <NavbarItem isActive={location.pathname === "/review"}>
            <Link className={getLinkStyles("/review")} href="/review">
              Review
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === "/rating"}>
            <Badge content="soon" color="default" size="sm">
              <Link
                className={getLinkStyles("/rating")}
                href="/rating"
                isDisabled
                aria-current="page"
              >
                Rating
              </Link>
            </Badge>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === "/wallet"}>
            <Badge content="soon" color="default" size="sm">
              <Link
                className={getLinkStyles("/wallet")}
                href="/wallet"
                isDisabled
              >
                Wallet
              </Link>
            </Badge>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              style={{ border: "1px solid #1a202c" }}
              variant="bordered"
              className="shadow-[0px_3px_0px_0px_#1a202c] bg-white"
              onPress={openSignUpModal}
            >
              Sign In
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <MobileMenu />
      {isSignUpModalOpen && (
        <SignUpModal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
      )}
    </>
  );
}
