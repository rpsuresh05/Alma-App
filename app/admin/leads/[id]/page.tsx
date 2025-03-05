"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileIcon, User } from "lucide-react"
import type { Lead } from "@/lib/types"
import Link from "next/link"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Assume authenticated, will redirect if not

  useEffect(() => {
    const fetchLead = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/leads/${leadId}`)

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false)
            router.push("/admin")
            return
          }

          if (response.status === 404) {
            throw new Error("Lead not found")
          }

          throw new Error("Failed to fetch lead details")
        }

        const data = await response.json()
        setLead(data)
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching lead details")
        console.error("Error fetching lead:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLead()
  }, [leadId, router])

  const handleUpdateStatus = async (newStatus: "PENDING" | "REACHED_OUT") => {
    if (!lead) return

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update lead status")
      }

      const updatedLead = await response.json()
      setLead(updatedLead)
    } catch (err) {
      console.error("Error updating lead status:", err)
      setError("Failed to update lead status")
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading lead details...</p>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Lead not found"}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-16 items-center border-b px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden md:flex">
            <nav className="flex items-center gap-6">
              <Link href="/admin" className="text-lg font-semibold transition-colors hover:text-primary">
                Leads
              </Link>
              <Link
                href="/admin/settings"
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">User</span>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold">Lead Details</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {lead.firstName} {lead.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{lead.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{lead.country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">LinkedIn Profile</p>
                  <a
                    href={
                      lead.linkedInProfile.startsWith("http") ? lead.linkedInProfile : `https://${lead.linkedInProfile}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {lead.linkedInProfile}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Case Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium">{lead.status}</p>
                    {lead.status === "PENDING" ? (
                      <Button size="sm" onClick={() => handleUpdateStatus("REACHED_OUT")}>
                        Mark as Reached Out
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus("PENDING")}>
                        Mark as Pending
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{new Date(lead.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visas of Interest</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.visasOfInterest.map((visa) => (
                      <div key={visa} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                        {visa}
                      </div>
                    ))}
                  </div>
                </div>
                {lead.resumeUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground">Resume</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FileIcon className="h-5 w-5 text-primary" />
                      <a
                        href={lead.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {lead.additionalInfo && (
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <p className="whitespace-pre-line">{lead.additionalInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

