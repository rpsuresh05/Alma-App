import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const fileId = params.id

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    })

    if (!file || !file.data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Create response with appropriate headers
    return new NextResponse(file.data, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `inline; filename="${file.filename}"`,
      },
    })
  } catch (error) {
    console.error("Error retrieving file:", error)
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 })
  }
}

