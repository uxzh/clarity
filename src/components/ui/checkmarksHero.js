import "../../CSS/Hero.css";
export default function CheckmarksHero() {
  return (
    <div className="flex justify-center space-x-8 py-4" id="checkmarkshero">
      <div className="flex items-center space-x-2">
        <CheckIcon className="text-blue-500" />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          No banking logins
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <CheckIcon className="text-blue-500" />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          No data selling
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <CheckIcon className="text-blue-500" />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          100% secure
        </span>
      </div>
    </div>
  );
}

function CheckIcon(props) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
