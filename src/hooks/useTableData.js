import { useMemo } from "react";
import { mockUsers, mockCards, mockReviews } from "../data/mockData";

export function useTableData(type) {
  const data = useMemo(() => {
    switch (type) {
      case "users":
        return mockUsers;
      case "cards":
        return mockCards;
      case "reviews":
        return mockReviews;
      default:
        return [];
    }
  }, [type]);

  const columns = useMemo(() => {
    switch (type) {
      case "users":
        return [
          { name: "NAME", uid: "name" },
          { name: "EMAIL", uid: "email" },
          { name: "STATUS", uid: "status" },
          { name: "ROLE", uid: "role" },
          { name: "ACTIONS", uid: "actions" },
        ];
      case "cards":
        return [
          { name: "NAME", uid: "name" },
          { name: "REVIEWS", uid: "reviews" },
          { name: "RATING", uid: "rating" },
          { name: "STATUS", uid: "status" },
          { name: "ACTIONS", uid: "actions" },
        ];
      case "reviews":
        return [
          { name: "USER", uid: "user" },
          { name: "CARD", uid: "card" },
          { name: "RATING", uid: "rating" },
          { name: "STATUS", uid: "status" },
          { name: "ACTIONS", uid: "actions" },
        ];
      default:
        return [];
    }
  }, [type]);

  return { data, columns };
}
