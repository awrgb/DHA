import { NextRequest, NextResponse } from "next/server"

import { placesApi } from "@/lib/api/places"

export async function GET(request: NextRequest) {
  try {
    // Extract the 'query' parameter from the incoming request
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""

    // Call getEmployees with the extracted query
    const employee = await placesApi.getEmployees(query)
    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch employee",
      },
      { status: 500 }
    )
  }
}
