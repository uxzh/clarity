import React, { useContext } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar as NextUIAvatar,
} from "@nextui-org/react";
import { AuthContext } from "../../../contexts/AuthContext";

const Avatar = React.memo(() => {
  const { user, logout } = useContext(AuthContext);
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <NextUIAvatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name="User Name"
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user?.email}</p>
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem key="logout" color="danger"
          onClick={() => logout()}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
});

export default Avatar;
