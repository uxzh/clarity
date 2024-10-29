import { Card } from "@nextui-org/react";

export default function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Users</h3>
        <p className="text-2xl font-bold">1,234</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Cards</h3>
        <p className="text-2xl font-bold">56</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Reviews</h3>
        <p className="text-2xl font-bold">4,567</p>
      </Card>
    </div>
  );
}
