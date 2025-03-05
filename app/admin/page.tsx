"use client";

import type React from "react";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search, User } from "lucide-react";
import type { Lead } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { DataTable } from "@/components/ui/tablev2";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useLeads } from "../hooks/useLeads";
import { ButtonLoading } from "@/components/ui/button-loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/app/hooks/useAuth";

const getColumns = function (
  handleUpdateStatus: (
    leadId: string,
    newStatus: "PENDING" | "REACHED_OUT"
  ) => Promise<void>,
  updatingLeadId: string | null
) {
  return [
    {
      accessorKey: "name",
      header: "Name",
      accessorFn: (row: Lead) => `${row.firstName} ${row.lastName}`,
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
      accessorFn: (row: Lead) => {
        const date = new Date(row.createdAt);
        return format(date, "dd/MM/yyyy, hh:mm a");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      accessorFn: (row: Lead) =>
        row.status === "PENDING" ? "Pending" : "Reached Out",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Lead } }) => {
        const lead = row.original;
        const isLoading = updatingLeadId === lead.id;

        return (
          <>
            {lead.status === "PENDING" ? (
              <ButtonLoading
                isLoading={isLoading}
                size="sm"
                loadingText="Mark as Reached Out"
                className="bg-[#1B1B1B] hover:bg-[#1B1B1B]/90"
                onClick={() => handleUpdateStatus(lead.id, "REACHED_OUT")}
              >
                Mark as Reached Out
              </ButtonLoading>
            ) : (
              <ButtonLoading
                isLoading={isLoading}
                loadingText="Mark as Pending"
                size="sm"
                className="bg-[#1B1B1B] hover:bg-[#1B1B1B]/90"
                onClick={() => handleUpdateStatus(lead.id, "PENDING")}
              >
                Mark as Pending
              </ButtonLoading>
            )}
          </>
        );
      },
    },
  ];
};

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("");
  const [error, setError] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const router = useRouter();

  const { getLeads, updateLeadStatus } = useLeads();
  const { logout } = useAuth();
  const {
    data,
    isLoading,
    error: queryError,
  } = getLeads({
    search: searchQuery,
    status: statusFilter || undefined,
  });

  const handleUpdateStatus = async (
    leadId: string,
    newStatus: "PENDING" | "REACHED_OUT"
  ) => {
    try {
      setUpdatingLeadId(leadId);
      await updateLeadStatus.mutateAsync({ leadId, status: newStatus });
    } catch (err) {
      console.error("Error updating lead status:", err);
      setError("Failed to update lead status");
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const columns = useMemo(
    () => getColumns(handleUpdateStatus, updatingLeadId),
    [handleUpdateStatus, updatingLeadId]
  );

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        console.error("Error logging out:", error);
        setError("Failed to logout");
      },
    });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex">
          <aside className="border-r p-4 flex flex-col gap-4 justify-between w-[280px] relative bg-[radial-gradient(circle_at_top_left,_#f8f8d8,_transparent_35%)]">
            <div className="">
              <Link href="/">
                <Image src="alma.png" alt="Banner" width={120} height={100} />
              </Link>

              <div className="flex  flex-col gap-2 p-4">
                <div className="flex h-12 items-center rounded-md px-4 font-bold ">
                  Leads
                </div>
                <div className="flex h-12 items-center rounded-md px-4 font-medium text-muted-foreground">
                  Settings
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-[#E9E9E9] flex items-center justify-center text-black">
                      A
                    </div>
                    <span className="font-bold">Admin User</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div
                    className="cursor-pointer p-2 hover:bg-gray-100 rounded-md"
                    onClick={handleLogout}
                  >
                    {logout.isPending ? "Logging out..." : "Logout"}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </aside>
          <main className="flex-1 p-4 md:p-6 bg-[radial-gradient(circle_at_top_left,_#f8f8d8,_transparent_8%)]">
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mt-2">Leads</h1>
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-8 md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select
                    value={statusFilter || ""}
                    onValueChange={(value) => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-[180px] [&[data-placeholder]]:text-muted-foreground">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REACHED_OUT">Reached Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2"></div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="rounded-lg border">
                <DataTable
                  columns={columns}
                  data={data?.leads || []}
                  pageSize={8}
                  initialSort={[{ id: "createdAt", desc: true }]}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
