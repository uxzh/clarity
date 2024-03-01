import { Link } from "@nextui-org/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t"
      style={{ position: "fixed", bottom: 0, maxWidth: "100vw" }}
    >
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
          <span>© {currentYear} Clarity. All rights reserved.</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          <span>Terms of Service</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span>Privacy</span>
        </p>
      </nav>
    </footer>
  );
}
