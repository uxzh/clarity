import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  User,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import {
  UserHistoryModal,
  UserEditModal,
  UserBlockModal,
} from "../modals/UserModals";
import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/dateFormatter";
import { useAdminContext } from "../contexts/AdminContext";
import { MODELS } from "../../../lib/models";
import { fetchAllPages } from "../utils";
import { useAuthContext } from "../../../contexts/AuthContext";

export default function UsersTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);

  const { api } = useAuthContext();
  const { data, dispatchData } = useAdminContext();

  useEffect(() => {
    if (data[MODELS.users].length !== 0) return;
    const fetchData = async () => {
      try {
        const data = await fetchAllPages(api.getUsers, 50);
        dispatchData({ type: "set", model: MODELS.users, data });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { name: "USER", uid: "user" },
    { name: "EMAIL", uid: "email" },
    { name: "ROLE", uid: "role" },
    { name: "STATUS", uid: "status" },
    { name: "LOGIN METHOD", uid: "loginMethod" },
    { name: "LAST LOGIN", uid: "lastLogin" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (user, columnKey) => {
    switch (columnKey) {
      case "user":
        return (
          <User
            name={user.username}
            description={`Previous: ${
              user.previousUsernames?.[user.previousUsernames.length - 1]
                ?.username || "None"
            }`}
            avatarProps={{
              src: user.avatar,
              size: "sm",
              radius: "lg",
            }}
          />
        );
      case "email":
        return (
          <div className="flex flex-col">
            <span>{user.email}</span>
            <Chip
              size="sm"
              variant="flat"
              color={user.emailVerified ? "success" : "warning"}
            >
              {user.emailVerified ? "Verified" : "Unverified"}
            </Chip>
          </div>
        );
      case "role":
        return (
          <Chip
            color={user.role === "admin" ? "secondary" : "primary"}
            variant="flat"
          >
            {user.role}
          </Chip>
        );
      case "status":
        return (
          <Chip color={user.isBlocked ? "danger" : "success"} variant="flat">
            {user.isBlocked ? "Blocked" : "Active"}
          </Chip>
        );
      case "loginMethod":
        return (
          <Chip variant="flat" color="default">
            {user.loginMethod}
          </Chip>
        );
      case "lastLogin":
        return <span>{formatDate(user.lastLogin)}</span>;
      case "createdAt":
        return <span>{formatDate(user.createdAt)}</span>;
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="View History">
              <Button
                size="sm"
                color="secondary"
                onPress={() => {
                  setSelectedUser(user);
                  setHistoryModalOpen(true);
                }}
              >
                History
              </Button>
            </Tooltip>
            <Button
              size="sm"
              color="primary"
              onPress={() => {
                setSelectedUser(user);
                setEditModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color={user.isBlocked ? "success" : "danger"}
              onPress={() => {
                setSelectedUser(user);
                setBlockModalOpen(true);
              }}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </Button>
          </div>
        );
      default:
        return user[columnKey];
    }
  };

  return (
    <>
      <Table
        aria-label="Users table"
        selectionMode="multiple"
        classNames={{
          table: "min-h-[100px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data[MODELS.users]}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UserHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        user={selectedUser}
      />
      <UserEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={selectedUser}
        onSave={(data) => {
          console.log("Saving user:", data);
          setEditModalOpen(false);
        }}
      />
      <UserBlockModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        user={selectedUser}
        onConfirm={(userId) => {
          console.log("Toggling block status for user:", userId);
          setBlockModalOpen(false);
        }}
      />
    </>
  );
}
