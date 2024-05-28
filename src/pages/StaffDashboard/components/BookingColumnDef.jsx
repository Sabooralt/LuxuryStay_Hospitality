import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isValid } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const columnDef = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "_id",
    id: "Booking Id",
    header: "Booking Id",
  },
  {
    accessorKey: "room.roomNumber",
    id: "Room Number",
    header: "Room Number",
  },
  {
    accessorKey: "member",
    id: "Member",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const member = row.original.member;
      return (
        <div>
          <div className="text-md font-medium">{member.fullName}</div>
          <div className="text-muted-foreground text-sm">{member.email}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "uniqueKey",
    id: "Access Key",
    header: "Access Key",
  },

  {
    accessorKey: "checkInDate",
    header: "Check In",
    cell: ({ row }) => {
      return <div>{format(row.getValue("checkInDate"), "MM/dd/yyyy")}</div>;
    },
  },

  {
    accessorKey: "checkOutDate",
    header: "Check Out",
    cell: ({ row }) => {
      return <div>{format(row.getValue("checkOutDate"), "MM/dd/yyyy")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status");

      return (
        <Badge variant={value === "booked" ? "outline" : "default"}>
          {value}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      const value = row.getValue("createdAt");

      return (
        <Badge variant={value === "booked" ? "outline" : "default"}>
          {format(value, "MM/dd/yyyy")}
        </Badge>
      );
    },
  },
];
