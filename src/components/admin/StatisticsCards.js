import { Card } from "@heroui/react";
import { useEffect } from "react";
import { useAdminContext } from "./contexts/AdminContext";
import { useAuthContext } from "../../contexts/AuthContext";

export default function StatisticsCards() {
  const { totals, setTotals } = useAdminContext();
  const { api } = useAuthContext();
  useEffect(() => {
    const getTotals = async () => {
      try {
        const res = await api.getTotals();
        setTotals(res.data);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    }
    getTotals();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Users</h3>
        <p className="text-2xl font-bold">{totals.users || 'NaN'}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Cards</h3>
        <p className="text-2xl font-bold">{totals.cards || 'NaN'}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Reviews</h3>
        <p className="text-2xl font-bold">{totals.reviews || 'NaN'}</p>
      </Card>
    </div>
  );
}
