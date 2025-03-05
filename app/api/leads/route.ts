import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

// GET /api/leads - Get all leads (admin only)
export async function GET(request: Request) {
  try {
    // Check authentication for admin routes
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")



    // Build the where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status && status !== "all") {
      where.status = status
    }

    // Get total count for pagination
    const total = await prisma.lead.count({ where })

    // Get leads with pagination
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },

      include: {
        files: {
          select: {
            id: true,
            filename: true,
          },
        },
      },
    })

    return NextResponse.json({
      leads,

    })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

// POST /api/leads - Create a new lead (public)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "linkedInProfile", "visasOfInterest"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create a new lead
    const newLead = await prisma.lead.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        country: body.country,
        linkedInProfile: body.linkedInProfile,
        visasOfInterest: body.visasOfInterest, // Postgres array type
        additionalInfo: body.additionalInfo,
        status: "PENDING",
      },
    })

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}

