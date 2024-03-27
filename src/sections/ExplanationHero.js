import { Button } from "@nextui-org/react";

export default function ExplanationHero() {
  return (
    <div className="relative max-w-[1200px] mx-auto">
      <img
        alt="Product"
        className="w-full h-auto"
        height="600"
        src="/placeholder.svg"
        style={{
          aspectRatio: "960/600",
          objectFit: "cover",
        }}
        width="960"
      />
      <div
        aria-describedby="product-explanation"
        className="absolute bottom-0 right-0 flex items-center justify-center p-4"
        style={{
          transform: "translateY(50%)",
        }}
      >
        <div className="bg-black bg-opacity-75 text-white max-w-md p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">How to use the product?</h2>
          <ol className="space-y-4">
            <li className="flex items-center">
              <UserIcon className="text-yellow-400 mr-2" />
              <span>Log in to your profile on the website</span>
            </li>
            <li className="flex items-center">
              <FileIcon className="text-blue-400 mr-2" />
              <span>
                Enter your photo and phone number on the page that appears
              </span>
            </li>
            <li className="flex items-center">
              <CurrencyIcon className="text-green-400 mr-2" />
              <span>
                Make your first deposit and get a bonus of up to 20,000 rubles
              </span>
            </li>
            <li className="flex items-center">
              <TrophyIcon className="text-yellow-300 mr-2" />
              <span>Place your first winning bet</span>
            </li>
          </ol>
          <Button className="mt-6 w-full">Go through identification</Button>
        </div>
      </div>
    </div>
  );
}

function CurrencyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <line x1="3" x2="6" y1="3" y2="6" />
      <line x1="21" x2="18" y1="3" y2="6" />
      <line x1="3" x2="6" y1="21" y2="18" />
      <line x1="21" x2="18" y1="21" y2="18" />
    </svg>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function TrophyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
