import React from "react";
import { Card } from "@nextui-org/react";
import { Icon } from "@iconify/react";

const cashbackCategories = [
  { name: "Travel", icon: "fluent-emoji-flat:palm-tree" },
  { name: "Dining", icon: "fluent-emoji-flat:fork-and-knife" },
  { name: "Groceries", icon: "fluent-emoji-flat:shopping-cart" },
  { name: "Gas", icon: "fluent-emoji-flat:fuel-pump" },
  { name: "Shopping", icon: "fluent-emoji-flat:shopping-bags" },
  { name: "Other", icon: "fluent-emoji-flat:money-with-wings" },
];

const Cashback = ({ cashbackPercentages }) => (
  <div className="p-4">
    <h3 className="font-semibold mb-4">Cashback Categories</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {cashbackCategories.map((category) => (
        <Card
          key={category.name}
          className="p-3 text-center flex flex-col items-center justify-center"
        >
          <Icon icon={category.icon} className="text-3xl mb-2" />
          <p className="font-medium">{category.name}</p>
          <p className="text-lg font-bold text-primary">
            {cashbackPercentages[category.name]}
          </p>
        </Card>
      ))}
    </div>
  </div>
);

export default React.memo(Cashback);
