export default function Screenshot() {
  return (
    <section className="flex items-center justify-center space-x-12 bg-white p-10">
      <div className="bg-black rounded-lg overflow-hidden">
        <img
          alt="Phone"
          className="h-[600px] w-[300px]"
          height="600"
          src="/placeholder.svg"
          style={{
            aspectRatio: "300/600",
            objectFit: "cover",
          }}
          width="300"
        />
      </div>
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="flex flex-col items-center">
          <BanknoteIcon className="text-green-500 h-16 w-16" />
          <h3 className="mt-4 text-lg font-semibold text-black">Big Payouts</h3>
          <p className="text-sm text-gray-400">Up to 10x</p>
        </div>
        <div className="flex flex-col items-center">
          <ReplyIcon className="text-blue-500 h-16 w-16" />
          <h3 className="mt-4 text-lg font-semibold text-black">24/7</h3>
          <p className="text-sm text-gray-400">Live Support</p>
        </div>
        <div className="flex flex-col items-center">
          <LockIcon className="text-purple-500 h-16 w-16" />
          <h3 className="mt-4 text-lg font-semibold text-black">
            Fast & Secure
          </h3>
          <p className="text-sm text-gray-400">Withdrawals</p>
        </div>
      </div>
    </section>
  );
}

function BanknoteIcon(props) {
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
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function LockIcon(props) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ReplyIcon(props) {
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
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}
