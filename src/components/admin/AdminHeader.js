import { Button } from "@nextui-org/react";

export default function AdminHeader({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <Button
              color={activeTab === "users" ? "primary" : "default"}
              onPress={() => setActiveTab("users")}
            >
              Users
            </Button>
            <Button
              color={activeTab === "cards" ? "primary" : "default"}
              onPress={() => setActiveTab("cards")}
            >
              Cards
            </Button>
            <Button
              color={activeTab === "reviews" ? "primary" : "default"}
              onPress={() => setActiveTab("reviews")}
            >
              Reviews
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
