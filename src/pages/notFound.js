import { Button, Link } from "@heroui/react";
import MainButton from "../components/buttons/MainButton";
import Lottie from "react-lottie";
import animationData from "../components/lotties/404.json";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function PageNotFound() {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div class="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <main class="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl text-center">
            <Lottie options={defaultOptions} style={{ cursor: "default" }} />
            <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
              Page not found
            </h1>
            <p class="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <div class="mt-8 flex justify-center flex-row items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                startContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2 h-5 w-5"
                  >
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                  </svg>
                }
                size="lg"
                variant="flat"
                onClick={handleGoBack}
              >
                Go back
              </Button>
              <MainButton
                text="Back home"
                link={"/"}
                newtab=""
                icon={<Icon icon="fluent:home-12-regular" />}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
