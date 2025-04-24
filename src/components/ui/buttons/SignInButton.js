import React from "react";
import { Button } from "@heroui/react";

const SignInButton = React.memo(({ onClick }) => {
  return (
    <Button
      style={{ border: "1px solid #1a202c" }}
      variant="bordered"
      className="shadow-[0px_3px_0px_0px_#1a202c] bg-white"
      onPress={onClick}
    >
      Sign In
    </Button>
  );
});

export default SignInButton;
