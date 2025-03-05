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

const mockLeads: Lead[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    linkedInProfile: "linkedin.com/in/johnsmith",
    visasOfInterest: ["O-1"],
    status: "PENDING",
    createdAt: "2024-01-15",
    country: "Canada",
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.g@email.com",
    linkedInProfile: "linkedin.com/in/mariagarcia",
    visasOfInterest: ["EB-1A"],
    status: "REACHED_OUT",
    createdAt: "2024-01-14",
    country: "Spain",
  },
  {
    id: "3",
    firstName: "Wei",
    lastName: "Chen",
    email: "wei.chen@email.com",
    linkedInProfile: "linkedin.com/in/weichen",
    visasOfInterest: ["EB-2 NIW"],
    status: "PENDING",
    createdAt: "2024-01-13",
    country: "China",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    linkedInProfile: "linkedin.com/in/sarahj",
    visasOfInterest: ["O-1", "EB-1A"],
    status: "REACHED_OUT",
    createdAt: "2024-01-12",
    country: "Canada",
  },
  {
    id: "5",
    firstName: "Raj",
    lastName: "Patel",
    email: "raj.patel@email.com",
    linkedInProfile: "linkedin.com/in/rajpatel",
    visasOfInterest: ["EB-2 NIW"],
    status: "PENDING",
    createdAt: "2024-01-11",
    country: "India",
  },
  {
    id: "6",
    firstName: "Anna",
    lastName: "Kowalski",
    email: "anna.k@email.com",
    linkedInProfile: "linkedin.com/in/annak",
    visasOfInterest: ["O-1"],
    status: "REACHED_OUT",
    createdAt: "2024-01-10",
    country: "Poland",
  },
  {
    id: "7",
    firstName: "Luis",
    lastName: "Rodriguez",
    email: "luis.r@email.com",
    linkedInProfile: "linkedin.com/in/luisr",
    visasOfInterest: ["EB-1A"],
    status: "PENDING",
    createdAt: "2024-01-09",
    country: "Mexico",
  },
  {
    id: "8",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.w@email.com",
    linkedInProfile: "linkedin.com/in/emmaw",
    visasOfInterest: ["O-1"],
    status: "REACHED_OUT",
    createdAt: "2024-01-08",
    country: "Australia",
  },
  {
    id: "9",
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed.h@email.com",
    linkedInProfile: "linkedin.com/in/ahmedh",
    visasOfInterest: ["EB-2 NIW"],
    status: "PENDING",
    createdAt: "2024-01-07",
    country: "Egypt",
  },
  {
    id: "10",
    firstName: "Sofia",
    lastName: "Silva",
    email: "sofia.s@email.com",
    linkedInProfile: "linkedin.com/in/sofias",
    visasOfInterest: ["O-1"],
    status: "REACHED_OUT",
    createdAt: "2024-01-06",
    country: "Brazil",
  },
  {
    id: "11",
    firstName: "Yuki",
    lastName: "Tanaka",
    email: "yuki.t@email.com",
    linkedInProfile: "linkedin.com/in/yukit",
    visasOfInterest: ["EB-1A"],
    status: "PENDING",
    createdAt: "2024-01-05",
    country: "Japan",
  },
  {
    id: "12",
    firstName: "Oliver",
    lastName: "Brown",
    email: "oliver.b@email.com",
    linkedInProfile: "linkedin.com/in/oliverb",
    visasOfInterest: ["O-1"],
    status: "REACHED_OUT",
    createdAt: "2024-01-04",
    country: "New Zealand",
  },
  {
    id: "13",
    firstName: "Elena",
    lastName: "Popov",
    email: "elena.p@email.com",
    linkedInProfile: "linkedin.com/in/elenap",
    visasOfInterest: ["EB-2 NIW"],
    status: "PENDING",
    createdAt: "2024-01-03",
    country: "Russia",
  },
  {
    id: "14",
    firstName: "Thomas",
    lastName: "Anderson",
    email: "thomas.a@email.com",
    linkedInProfile: "linkedin.com/in/thomasa",
    visasOfInterest: ["EB-1A"],
    status: "REACHED_OUT",
    createdAt: "2024-01-02",
    country: "Sweden",
  },
  {
    id: "15",
    firstName: "Fatima",
    lastName: "Ali",
    email: "fatima.a@email.com",
    linkedInProfile: "linkedin.com/in/fatimaa",
    visasOfInterest: ["O-1"],
    status: "PENDING",
    createdAt: "2024-01-01",
    country: "UAE",
  },
  {
    id: "16",
    firstName: "Marco",
    lastName: "Rossi",
    email: "marco.r@email.com",
    linkedInProfile: "linkedin.com/in/marcor",
    visasOfInterest: ["EB-2 NIW"],
    status: "REACHED_OUT",
    createdAt: "2023-12-31",
    country: "Italy",
  },
  {
    id: "17",
    firstName: "Nina",
    lastName: "Schmidt",
    email: "nina.s@email.com",
    linkedInProfile: "linkedin.com/in/ninas",
    visasOfInterest: ["O-1"],
    status: "PENDING",
    createdAt: "2023-12-30",
    country: "Germany",
  },
  {
    id: "18",
    firstName: "Carlos",
    lastName: "Santos",
    email: "carlos.s@email.com",
    linkedInProfile: "linkedin.com/in/carloss",
    visasOfInterest: ["EB-1A"],
    status: "REACHED_OUT",
    createdAt: "2023-12-29",
    country: "Portugal",
  },
  {
    id: "19",
    firstName: "Lily",
    lastName: "Zhang",
    email: "lily.z@email.com",
    linkedInProfile: "linkedin.com/in/lilyz",
    visasOfInterest: ["EB-2 NIW"],
    status: "PENDING",
    createdAt: "2023-12-28",
    country: "Singapore",
  },
  {
    id: "20",
    firstName: "James",
    lastName: "Taylor",
    email: "james.t@email.com",
    linkedInProfile: "linkedin.com/in/jamest",
    visasOfInterest: ["O-1"],
    status: "REACHED_OUT",
    createdAt: "2023-12-27",
    country: "Ireland",
  },
];

const getColumns = function (
  handleUpdateStatus: (
    leadId: string,
    newStatus: "PENDING" | "REACHED_OUT"
  ) => Promise<void>
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
        return (
          <>
            {lead.status === "PENDING" ? (
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(lead.id, "REACHED_OUT")}
              >
                Mark as Reached Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(lead.id, "PENDING")}
              >
                Mark as Pending
              </Button>
            )}
          </>
        );
      },
    },
  ];
};

export default function AdminPage() {
  const { getLeads } = useLeads();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleUpdateStatus = async (
    leadId: string,
    newStatus: "PENDING" | "REACHED_OUT"
  ) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lead status");
      }

      // Refresh leads after update
      fetchLeads();
    } catch (err) {
      console.error("Error updating lead status:", err);
      setError("Failed to update lead status");
    }
  };
  const columns = useMemo(
    () => getColumns(handleUpdateStatus),
    [handleUpdateStatus]
  );
  // Mock authentication - in a real app, this would check if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }
      if (statusFilter && statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      // queryParams.append("page", currentPage.toString());
      // queryParams.append("limit", leadsPerPage.toString());

      const response = await fetch(`/api/leads?${queryParams.toString()}`);

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error("You must be logged in to view this page");
        }
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();
      setLeads(data.leads);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching leads");
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated, fetchLeads]);

  // Login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Invalid credentials");
      }

      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {loginError}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm">
              <div>
                {/* <label htmlFor="email-address" className="sr-only">
                  Email address
                </label> */}
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                {/* <label htmlFor="password" className="sr-only">
                  Password
                </label> */}
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex">
          <aside className="border-r p-4 flex flex-col gap-4 justify-between w-[280px] relative bg-[radial-gradient(circle_at_top_left,_#f8f8d8,_transparent_35%)]">
            <div className="">
              <Image src="alma.png" alt="Banner" width={120} height={100} />

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
              <div className="h-10 w-10 rounded-full bg-[#E9E9E9] flex items-center justify-center text-black">
                A
              </div>

              <span className="font-bold">Admin User</span>
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
                  data={leads}
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
