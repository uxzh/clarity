import React, { useState, useCallback, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Link,
  Checkbox,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { AnimatePresence, m, domAnimation, LazyMotion } from "framer-motion";
import { Icon } from "@iconify/react";
import { AuthContext } from "../../../contexts/AuthContext";
import SignUpSuccess from "./SignUpSuccess";

const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (isSignUp) => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (formData.password.length > 50)
      newErrors.password = "Password must be less than 50 characters";

    if (isSignUp) {
      if (!formData.username) newErrors.username = "Username is required";
      else if (formData.username.length < 5)
        newErrors.username = "Username must be at least 5 characters";
      else if (formData.username.length > 50)
        newErrors.username = "Username must be less than 50 characters";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm password is required";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, handleChange, errors, setErrors, validateForm };
};

const ButtonSection = ({ isSignUp, setIsFormVisible }) => (
  <m.div
    key="buttons"
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={variants}
    transition={{ duration: 0.3 }}
  >
    <Button
      color="default"
      variant="bordered"
      startContent={<Icon icon="flat-color-icons:google" />}
      className="w-full mb-3"
      onPress={() => setIsFormVisible(true)}
    >
      {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
    </Button>
    <Button
      color="primary"
      className="w-full"
      onPress={() => setIsFormVisible(true)}
    >
      {isSignUp ? "Sign Up with Email" : "Sign In with Email"}
    </Button>
  </m.div>
);

const FormSection = ({
  isSignUp,
  formData,
  handleChange,
  errors,
  handleSubmit,
  isLoading,
}) => (
  <m.form
    key="form"
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={variants}
    transition={{ duration: 0.3 }}
    onSubmit={handleSubmit}
  >
    {isSignUp && (
      <Tooltip content="Username must be 5-50 characters long">
        <Input
          isRequired
          label="Username"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          className="mb-3"
          errorMessage={errors.username}
        />
      </Tooltip>
    )}
    <Tooltip content="Enter a valid email address">
      <Input
        isRequired
        label="Email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        className="mb-3"
        errorMessage={errors.email}
      />
    </Tooltip>
    <Tooltip content="Password must be 8-50 characters long">
      <Input
        isRequired
        label="Password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        className="mb-3"
        type={formData.isPasswordVisible ? "text" : "password"}
        errorMessage={errors.password}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() =>
              handleChange({
                target: {
                  name: "isPasswordVisible",
                  value: !formData.isPasswordVisible,
                },
              })
            }
          >
            <Icon
              icon={formData.isPasswordVisible ? "mdi:eye-off" : "mdi:eye"}
            />
          </button>
        }
      />
    </Tooltip>
    {isSignUp && (
      <Input
        isRequired
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="mb-3"
        type={formData.isConfirmPasswordVisible ? "text" : "password"}
        errorMessage={errors.confirmPassword}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() =>
              handleChange({
                target: {
                  name: "isConfirmPasswordVisible",
                  value: !formData.isConfirmPasswordVisible,
                },
              })
            }
          >
            <Icon
              icon={
                formData.isConfirmPasswordVisible ? "mdi:eye-off" : "mdi:eye"
              }
            />
          </button>
        }
      />
    )}
    <div className="flex justify-between items-center">
      <Checkbox
        isSelected={formData.rememberMe}
        onValueChange={(value) =>
          handleChange({ target: { name: "rememberMe", value } })
        }
      >
        Remember me
      </Checkbox>
      {!isSignUp && (
        <Link href="#" size="sm">
          Forgot password?
        </Link>
      )}
    </div>
    <Button
      color="primary"
      className="w-full mt-4"
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner color="current" size="sm" />
      ) : isSignUp ? (
        "Sign Up with Email"
      ) : (
        "Sign In with Email"
      )}
    </Button>
  </m.form>
);

const variants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 10 },
};

const ErrorDisplay = ({ message }) => (
  <div
    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
    role="alert"
  >
    <p className="font-bold">Error</p>
    <p>{message}</p>
  </div>
);

const SuccessDisplay = ({ message }) => (
  <div
    className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
    role="alert"
  >
    <p className="font-bold">Success</p>
    <p>{message}</p>
  </div>
);

export default function SignUpModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const initialFormState = {
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    isPasswordVisible: false,
    isConfirmPasswordVisible: false,
    rememberMe: false,
  };

  const { formData, handleChange, errors, setErrors, validateForm } =
    useForm(initialFormState);

  const { api, login } = useContext(AuthContext);

  const toggleSignUp = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setIsFormVisible(false);
    setApiError(null);
    setApiSuccess(null);
    setErrors({});
  }, [setErrors]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (validateForm(isSignUp)) {
        setIsLoading(true);
        setApiError(null);
        setApiSuccess(null);
        try {
          const response = await api[isSignUp ? "signup" : "login"]({
            email: formData.email,
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          });
          if (isSignUp) {
            setShowSuccessModal(true);
            onClose();
          } else {
            login(response.data);
            onClose();
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            setApiError(error.response.data.error);
            if (error.response.data.error === "Username already in use") {
              setErrors((prev) => ({
                ...prev,
                username: "Username is already taken",
              }));
            }
          } else {
            setApiError("An unexpected error occurred. Please try again.");
          }
          console.error("Authentication error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [formData, validateForm, isSignUp, api, login, onClose]
  );

  return (
    <>
      <LazyMotion features={domAnimation}>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {isSignUp ? "Create an account" : "Welcome back"}
            </ModalHeader>
            <ModalBody>
              {apiError && <ErrorDisplay message={apiError} />}
              {apiSuccess && <SuccessDisplay message={apiSuccess} />}
              <AnimatePresence mode="wait">
                {!isFormVisible ? (
                  <ButtonSection
                    isSignUp={isSignUp}
                    setIsFormVisible={setIsFormVisible}
                  />
                ) : (
                  <FormSection
                    isSignUp={isSignUp}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                )}
              </AnimatePresence>
            </ModalBody>
            <ModalFooter>
              <div className="w-full text-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {isSignUp
                    ? "Already have an account?"
                    : "Need to create an account?"}
                </span>{" "}
                <Link href="#" onPress={toggleSignUp}>
                  {isSignUp ? "Log In" : "Sign Up"}
                </Link>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </LazyMotion>
      <SignUpSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
