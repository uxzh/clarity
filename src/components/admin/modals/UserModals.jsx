import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  User,
  Chip,
} from "@nextui-org/react";
import { formatDate } from "../../../utils/dateFormatter";

export const UserHistoryModal = ({ isOpen, onClose, user }) => {
  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex gap-3">
          <User
            name={user?.username}
            description={user?.email}
            avatarProps={{
              src: user?.avatar,
              size: "lg",
              radius: "lg",
            }}
          />
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Account Information
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  Role:
                  <Chip
                    className="ml-2"
                    color={user?.role === "admin" ? "secondary" : "primary"}
                  >
                    {user?.role}
                  </Chip>
                </div>
                <div>
                  Status:
                  <Chip
                    className="ml-2"
                    color={user?.isBlocked ? "danger" : "success"}
                  >
                    {user?.isBlocked ? "Blocked" : "Active"}
                  </Chip>
                </div>
                <div>
                  Login Method:
                  <Chip className="ml-2">{user?.loginMethod}</Chip>
                </div>
                <div>
                  Email Verified:
                  <Chip
                    className="ml-2"
                    color={user?.emailVerified ? "success" : "warning"}
                  >
                    {user?.emailVerified ? "Yes" : "No"}
                  </Chip>
                </div>
                <div>Created: {formatDate(user?.createdAt)}</div>
                <div>Last Login: {formatDate(user?.lastLogin)}</div>
                <div>Last Updated: {formatDate(user?.updatedAt)}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Username History</h3>
              <Table aria-label="Username history">
                <TableHeader>
                  <TableColumn>USERNAME</TableColumn>
                  <TableColumn>CHANGED AT</TableColumn>
                </TableHeader>
                <TableBody items={user?.previousUsernames || []}>
                  {(item) => (
                    <TableRow key={item.updatedAt || item.updateAt}>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>
                        {formatDate(item.updatedAt || item.updateAt)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const UserEditModal = ({ isOpen, onClose, user, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      username: e.target.username.value,
      email: e.target.email.value,
      role: e.target.role.value,
      isBlocked: e.target.isBlocked.checked,
      emailVerified: e.target.emailVerified.checked,
    });
  };

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit User</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Username"
                name="username"
                defaultValue={user?.username}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                defaultValue={user?.email}
                required
              />
              <select
                name="role"
                className="w-full rounded-lg border p-2"
                defaultValue={user?.role}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <Checkbox name="isBlocked" defaultSelected={user?.isBlocked}>
                Block User
              </Checkbox>
              <Checkbox
                name="emailVerified"
                defaultSelected={user?.emailVerified}
              >
                Email Verified
              </Checkbox>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const UserBlockModal = ({ isOpen, onClose, user, onConfirm }) => {
  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{user?.isBlocked ? "Unblock" : "Block"} User</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to {user?.isBlocked ? "unblock" : "block"}{" "}
            {user?.username}?
          </p>
          {!user?.isBlocked && (
            <p className="text-sm text-danger mt-2">
              This will prevent the user from logging in and performing any
              actions.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color={user?.isBlocked ? "success" : "danger"}
            onPress={() => onConfirm(user?._id)}
          >
            {user?.isBlocked ? "Unblock" : "Block"} User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
