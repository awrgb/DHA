import { NextResponse } from "next/server"

import { currentRole } from "@/lib/current-user"
import { UserRole } from "@/types/api"

export async function GET() {
  const role = await currentRole()

  if (role === UserRole.ADMIN) {
    return new NextResponse(null, { status: 200 })
  }

  return new NextResponse(null, { status: 403 })
}
