import React, { useState } from "react";
import { Modal, Button, Avatar, Input } from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";

const ProfilePopup = ({ isOpen, onClose, user }) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [username, setUsername] = useState(user.username);

  const generateNewAvatar = () => {
    const newSeed = uuidv4();
    const newAvatarUrl = `https://avatars.dicebear.com/api/notionists/${newSeed}.svg`;
    setAvatarUrl(newAvatarUrl);
  };

  const handleSave = () => {
    // Mockup for saving the new avatar and other settings
    console.log("New avatar URL:", avatarUrl);
    console.log("New username:", username);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2>My Settings</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center">
          <Avatar src={avatarUrl} size="xl" className="mb-4" />
          <Button onClick={generateNewAvatar} className="mb-4">
            Generate New Avatar
          </Button>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <Button className="mb-4">Change Password</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfilePopup;
