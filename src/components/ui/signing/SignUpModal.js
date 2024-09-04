import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Link,
  Divider,
  Checkbox,
} from "@nextui-org/react";
import { AnimatePresence, m, domAnimation, LazyMotion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function SignUpModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };

  const orDivider = (
    <div className="flex items-center gap-4 py-2">
      <Divider className="flex-1" />
      <p className="shrink-0 text-tiny text-default-500">OR</p>
      <Divider className="flex-1" />
    </div>
  );

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (isSignUp && !username) newErrors.username = "Username is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted", { email, password, username, rememberMe });
      onClose();
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
  };

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isSignUp ? "Sign Up 📝" : "Log In 👋"}
            </ModalHeader>
            <ModalBody>
              <AnimatePresence initial={false} mode="popLayout">
                <LazyMotion features={domAnimation}>
                  {isFormVisible ? (
                    <m.form
                      animate="visible"
                      className="flex flex-col gap-y-3"
                      exit="hidden"
                      initial="hidden"
                      variants={variants}
                      onSubmit={handleSubmit}
                    >
                      <Input
                        autoFocus
                        label="Email Address"
                        type="email"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email}
                      />
                      {isSignUp && (
                        <Input
                          label="Username"
                          variant="bordered"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          isInvalid={!!errors.username}
                          errorMessage={errors.username}
                        />
                      )}
                      <Input
                        label="Password"
                        type={isPasswordVisible ? "text" : "password"}
                        variant="bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password}
                        endContent={
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {isPasswordVisible ? (
                              <Icon
                                className="pointer-events-none text-2xl text-default-400"
                                icon="solar:eye-closed-linear"
                              />
                            ) : (
                              <Icon
                                className="pointer-events-none text-2xl text-default-400"
                                icon="solar:eye-bold"
                              />
                            )}
                          </button>
                        }
                      />
                      <div className="flex items-center justify-between px-1 py-2">
                        <Checkbox
                          size="sm"
                          isSelected={rememberMe}
                          onValueChange={setRememberMe}
                        >
                          Remember me
                        </Checkbox>
                        <Link className="text-default-500" href="#" size="sm">
                          Forgot password?
                        </Link>
                      </div>
                      <Button color="primary" type="submit">
                        {isSignUp ? "Sign Up" : "Log In"}
                      </Button>
                      {orDivider}
                      <Button
                        fullWidth
                        startContent={
                          <Icon
                            className="text-default-500"
                            icon="solar:arrow-left-linear"
                            width={18}
                          />
                        }
                        variant="flat"
                        onPress={() => setIsFormVisible(false)}
                      >
                        Other {isSignUp ? "Sign Up" : "Login"} options
                      </Button>
                    </m.form>
                  ) : (
                    <>
                      <Button
                        fullWidth
                        color="primary"
                        startContent={
                          <Icon
                            className="pointer-events-none text-2xl"
                            icon="solar:letter-bold"
                          />
                        }
                        type="button"
                        onPress={() => setIsFormVisible(true)}
                      >
                        Continue with Email
                      </Button>
                      {orDivider}
                      <m.div
                        animate="visible"
                        className="flex flex-col gap-y-2"
                        exit="hidden"
                        initial="hidden"
                        variants={variants}
                      >
                        <Button
                          fullWidth
                          startContent={
                            <Icon icon="flat-color-icons:google" width={24} />
                          }
                          variant="flat"
                        >
                          Continue with Google
                        </Button>
                        <p className="mt-3 text-center text-small">
                          {isSignUp
                            ? "Already have an account?"
                            : "Need to create an account?"}
                          &nbsp;
                          <Link href="#" size="sm" onClick={toggleMode}>
                            {isSignUp ? "Log In" : "Sign Up"}
                          </Link>
                        </p>
                      </m.div>
                    </>
                  )}
                </LazyMotion>
              </AnimatePresence>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
