
import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth/middleware"
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    const { password: _, ...userWithoutPassword } = user
    const userData = {
      ...userWithoutPassword,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
