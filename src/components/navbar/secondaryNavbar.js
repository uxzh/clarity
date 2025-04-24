import {
    Navbar,
    NavbarContent,
    NavbarItem,
    Link,
} from "@heroui/react";

const SecondaryNavbar = () => {
    return (
        <Navbar shouldHideOnScroll fixed="top" shadow="none" color="light" style={{ translateX: "-13.5%", translateY: "-50%" }}>
            <NavbarContent  className="hidden sm:flex gap-8" justify="start">
                <NavbarItem>
                    <Link color="foreground" href="/overview">Overview</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/privacy-policy">Privacy Policy</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/tos">Terms of Service</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/faq">FAQ</Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default SecondaryNavbar;