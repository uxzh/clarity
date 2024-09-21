import React, { useState, lazy, Suspense } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Badge,
  Skeleton,
} from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { ReactComponent as Clarity } from "../../lib/logo2.svg";
import MobileMenu from "./mobileMenu";
// import useAuth from "../../hooks/useAuth";
import Avatar from "../ui/signed/Avatar";
import SignInButton from "../ui/buttons/SignInButton";

const SignUpModal = lazy(() => import("../ui/signing/SignUpModal"));

const ActiveNavbar = React.memo(() => {
  const location = useLocation();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const isLoggedIn = true; // Test variable
  // const { isLoggedIn } = useAuth();

  const getLinkStyles = (path) => {
    return location.pathname === path
      ? "text-black font-extrabold"
      : "text-foreground";
  };

  const handleSignInClick = () => {
    setIsModalLoading(true);
    setIsSignUpModalOpen(true);
  };

  const handleModalClose = () => {
    setIsSignUpModalOpen(false);
    setIsModalLoading(false);
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
            {isLoggedIn ? (
              <Avatar />
            ) : (
              <SignInButton onClick={handleSignInClick}>
                {isModalLoading ? (
                  <Skeleton className="h-4 w-16 rounded-lg" />
                ) : (
                  "Sign In"
                )}
              </SignInButton>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <MobileMenu />
      {isSignUpModalOpen && (
        <Suspense fallback={null}>
          <SignUpModal
            isOpen={isSignUpModalOpen}
            onClose={handleModalClose}
            onOpenChange={(isOpen) => {
              if (!isOpen) handleModalClose();
            }}
          />
        </Suspense>
      )}
    </>
  );
});

export default ActiveNavbar;
