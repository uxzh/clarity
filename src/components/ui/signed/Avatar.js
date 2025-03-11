import React, { useState, useCallback } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar as NextUIAvatar,
} from "@heroui/react";
import { useAuthContext } from "../../../contexts/AuthContext";
import ProfilePopup from "./ProfilePopup";

const Avatar = React.memo(() => {
  const { user, logout, api } = useAuthContext();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  const handleProfilePopupOpen = useCallback(() => {
    setIsProfilePopupOpen(true);
  }, []);

  const handleProfilePopupClose = useCallback(() => {
    setIsProfilePopupOpen(false);
  }, []);

  const handleSaveProfile = useCallback(
    async (updatedData) => {
      try {
        await api.updateUser(user._id, updatedData);
      } catch (err) {
        console.error("Failed to update user profile:", err);
      }
      handleProfilePopupClose();
    },
    []
  );

  // console log user's info
  if (process.env.NODE_ENV === 'development') {
    console.log(user);
  }

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <NextUIAvatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name={user?.username || "User"}
            size="sm"
            src={user?.avatar}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed as {user?.username}</p>
          </DropdownItem>
          <DropdownItem key="settings" onPress={handleProfilePopupOpen}>
            My Settings
          </DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout" color="danger" onPress={logout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={handleProfilePopupClose}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  );
});

export default Avatar;
