import { Button, Link } from "@nextui-org/react";
import React from "react";

const MainButton = ({
  text = "Button Text",
  size = "lg",
  link,
  icon,
  newtab = "__blank",
}) => (
  <Button
    startContent={icon}
    as={Link}
    size={size}
    href={link}
    target={newtab}
    variant="bordered"
    className="shadow-[0px_3px_0px_0px_#1a202c] "
    style={{ border: "2px solid #1a202c", backgroundColor: "white" }}
  >
    {text}
  </Button>
);

export default MainButton;
