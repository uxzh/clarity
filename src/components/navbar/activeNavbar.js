import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { useLocation } from "react-router-dom";
//import logo as svg
import { ReactComponent as Clarity } from "../../lib/logo2.svg";

export default function ActiveNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    "Beta Registration",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      style={{
        marginBottom: "8rem",
        background: "transparent",
        overflow: "hidden",
        isBlurred: false,
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand href="/" as={Link}>
          <Clarity style={{ width: 48, marginRight: 4 }} />
          <p
            style={{ color: "black" }}
            className="font-extrabold text-black text-inherit"
          >
            Clarity
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem isActive={location.pathname === "/reviews"}>
          <Link
            color={location.pathname === "/reviews" ? "primary" : "foreground"}
            href="/reviews"
          >
            Review
          </Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === "/rating"}>
          <Link
            color={location.pathname === "/rating" ? "primary" : "foreground"}
            href="/rating"
            aria-current="page"
          >
            Rating
          </Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === "/wallet"}>
          <Link
            color={location.pathname === "/wallet" ? "primary" : "foreground"}
            href="/wallet"
          >
            Wallet
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link style={{ color: "black" }} href="#">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="https://forms.gle/kcRvqnSBm1XSQVfa7"
            style={{ border: "1px solid #1a202c" }}
            target="_blank"
            variant="bordered"
            className="shadow-[0px_3px_0px_0px_#1a202c] "
          >
            Beta Registration
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
