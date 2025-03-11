import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Badge, Chip } from "@heroui/react";

const MobileMenu = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 sm:hidden z-50">
      <Link
        to="/review"
        className={`${
          location.pathname === "/review" ? "text-primary" : "text-gray-500"
        } `}
      >
        <Icon icon="solar:card-search-bold" width="24" height="24" />
      </Link>
      <div className="text-gray-500 relative ">
        <Icon icon="solar:crown-star-bold" width="24" height="24" />
      </div>
      <div className="text-gray-500 relative ">
        <Icon icon="solar:wallet-bold" width="24" height="24" />
      </div>
      <div className="text-gray-500 relative ">
        <Icon icon="iconamoon:profile-fill" width="24" height="24" />
      </div>
      <Chip size="sm" className="absolute lowercase top-[-14px] right-4">
        More Features Coming Soon
      </Chip>
    </div>
  );
};

export default MobileMenu;
