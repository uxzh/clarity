import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  useDisclosure,
} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";
import { IconSquareCheck } from "@tabler/icons-react";
import { IconSquareX } from "@tabler/icons-react";

const ProfilePopup = ({ isOpen, onClose, user, onSave }) => {
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [username, setUsername] = useState(user?.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { onOpenChange } = useDisclosure();

  const generateNewAvatar = useCallback(() => {
    try {
      const newSeed = uuidv4();
      const newAvatarUrl = `https://api.dicebear.com/6.x/notionists/svg?seed=${newSeed}`;
      setAvatarUrl(newAvatarUrl);
    } catch (err) {
      setError("Failed to generate new avatar. Please try again.");
      console.error("Avatar generation error:", err);
    }
  }, []);

  const checkUsernameAvailability = useCallback(async (username) => {
    // This is a placeholder for the actual API call
    // Replace this with your actual API endpoint when it's ready
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.5); // Simulate API response
      }, 300);
    });
  }, []);

  const debouncedCheckUsername = useCallback(
    debounce(async (username) => {
      if (username && username !== user.username) {
        const isAvailable = await checkUsernameAvailability(username);
        setIsUsernameAvailable(isAvailable);
      } else {
        setIsUsernameAvailable(true);
      }
    }, 300),
    [checkUsernameAvailability, user.username]
  );

  useEffect(() => {
    debouncedCheckUsername(username);
  }, [username, debouncedCheckUsername]);

  const handleSave = useCallback(() => {
    try {
      if (!username.trim()) {
        throw new Error("Username cannot be empty");
      }
      if (!isUsernameAvailable) {
        throw new Error("Username is not available");
      }
      if (isChangingPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (newPassword.length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }
      }
      onSave({
        avatarUrl,
        username,
        ...(isChangingPassword ? { newPassword } : {}),
      });
      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Save error:", err);
    }
  }, [
    avatarUrl,
    username,
    isUsernameAvailable,
    isChangingPassword,
    newPassword,
    confirmPassword,
    onSave,
    onClose,
  ]);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    setError(null);
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              My Settings
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center space-y-4">
                {error && (
                  <div className="text-red-500 text-sm font-medium">
                    {error}
                  </div>
                )}
                <Avatar
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-32 h-32"
                  fallback={
                    <div className="w-24 h-24 bg-gray-200 rounded-full" />
                  }
                />
                <Button auto color="primary" onPress={generateNewAvatar}>
                  Generate New Avatar
                </Button>
                <Input
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your username"
                  color={isUsernameAvailable ? "default" : "error"}
                />
                {!isUsernameAvailable && (
                  <div className="text-red-500 text-sm">
                    Username is not available
                  </div>
                )}
                <Button
                  auto
                  onPress={() => setIsChangingPassword(!isChangingPassword)}
                >
                  {isChangingPassword
                    ? "Cancel Password Change"
                    : "Change Password"}
                </Button>
                {isChangingPassword && (
                  <>
                    <Input
                      fullWidth
                      type="password"
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Input
                      fullWidth
                      type="password"
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                auto
                startContent={<IconSquareX stroke={1.5} />}
                variant="flat"
                color="danger"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color="success"
                variant="flat"
                startContent={<IconSquareCheck stroke={1.5} />}
                auto
                onPress={handleSave}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProfilePopup;
