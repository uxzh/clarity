import { Button } from "@nextui-org/react";
import { Status } from "../components/admin/Status";
import { CopyText } from "../components/admin/copy-text";
import { IconAlertCircleFilled } from "@tabler/icons-react";

export function renderCell(item, columnKey) {
  const cellValue = item[columnKey];

  switch (columnKey) {
    case "status":
      return <Status status={cellValue} />;
    case "email":
      return <CopyText>{cellValue}</CopyText>;
    case "actions":
      return (
        <div className="flex gap-2">
          <Button size="sm" color="primary">
            Edit
          </Button>
          <Button size="sm" color="danger">
            Delete
          </Button>
        </div>
      );
    case "rating":
      return (
        <div className="flex items-center gap-1">
          <span>{cellValue}</span>
          <IconAlertCircleFilled />
        </div>
      );
    default:
      return cellValue;
  }
}
