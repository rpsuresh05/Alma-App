import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Function to handle file uploads
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const leadId = formData.get("leadId") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 })
    }

    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Convert file to buffer for database storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Store file in database
    const fileRecord = await prisma.file.create({
      data: {
        filename: file.name,
        contentType: file.type,
        size: buffer.length,
        data: buffer,
        leadId: leadId,
      },
    })

    // Update the lead with the file reference
    await prisma.lead.update({
      where: { id: leadId },
      data: { resumeUrl: `/api/files/${fileRecord.id}` },
    })

    return NextResponse.json({
      success: true,
      fileId: fileRecord.id,
      url: `/api/files/${fileRecord.id}`,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

