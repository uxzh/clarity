import { useContext, useState } from "react";
import TopNavbar from "../components/navbar/activeNavbar";
import AdminHeader from "../components/admin/AdminHeader";
import StatisticsCards from "../components/admin/StatisticsCards";
import UsersTable from "../components/admin/tables/UsersTable";
import CardsTable from "../components/admin/tables/CardsTable";
import ReviewsTable from "../components/admin/tables/ReviewsTable";
import { AuthContext } from "../contexts/AuthContext";
import { AdminProvider } from "../components/admin/contexts/AdminContext";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("cards");
  const { user } = useContext(AuthContext);

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-100">
        <TopNavbar className="mb-0 !important" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center">Access Denied</h1>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
    <div className="min-h-screen bg-gray-100">
      <TopNavbar className="mb-0 !important" />
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <StatisticsCards />
        {activeTab === "users" && <UsersTable />}
        {activeTab === "cards" && <CardsTable />}
        {activeTab === "reviews" && <ReviewsTable />}
      </div>
    </div>
    </AdminProvider>
  );
}
