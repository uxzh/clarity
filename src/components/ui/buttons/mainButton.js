import React from "react";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

const CustomButton = ({ children, href, target, ...props }) => {
  return (
    <Button
      as={Link}
      href={href}
      target={target}
      style={{ border: "1px solid #1a202c" }}
      variant="bordered"
      className="shadow-[0px_3px_0px_0px_#1a202c] custom-button"
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
