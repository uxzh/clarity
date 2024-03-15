import { Button } from "@nextui-org/react";

export default function ScreenshotExplanation() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center py-8 lg:py-16">
          <div className="lg:w-1/2" style={{ width: "45%" }}>
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl sm:leading-none lg:text-5xl">
              Clarity is here to assist you with your payments and financial
              needs.
            </h1>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg leading-6 font-medium text-gray-900">
                    You are not charged taxes for every individual transaction
                  </p>
                  <p className="text-base leading-6 text-gray-500">
                    Increase your earnings without worrying about fees or
                    transaction taxes. This approach benefits everyone involved.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg leading-6 font-medium text-gray-900">
                    Experience worry-free transactions with ease and safety
                  </p>
                  <p className="text-base leading-6 text-gray-500">
                    Boost your income without concerns about fees or transaction
                    taxes. This approach benefits all parties involved.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg leading-6 font-medium text-gray-900">
                    Ideal for individuals and businesses alike
                  </p>
                  <p className="text-base leading-6 text-gray-500">
                    Elevate your earnings without any worries regarding fees or
                    transaction taxes. This approach brings advantages to all
                    parties.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button className="bg-blue-600 text-white">About Us</Button>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-10 relative" style={{ width: "25%" }}>
            <img
              alt="Mobile app screenshot"
              className="rounded-xl shadow-xl"
              height="600"
              src="/placeholder.svg"
              style={{
                aspectRatio: "300/600",
                objectFit: "cover",
              }}
              width="300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
