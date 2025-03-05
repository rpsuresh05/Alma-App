import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

// GET /api/leads/[id] - Get a specific lead (admin only)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        files: {
          select: {
            id: true,
            filename: true,
            contentType: true,
            size: true,
            createdAt: true,
          },
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 })
  }
}

// PATCH /api/leads/[id] - Update a lead (admin only)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await request.json()

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    })

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Update the lead
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        status: body.status || undefined,
        // Add other fields that can be updated
      },
    })

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }
}

