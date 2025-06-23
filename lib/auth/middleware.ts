
"use server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./jwt"
import { getDataSource } from "../db/data-source"
import { User } from "../entities/User"

export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    const dataSource = await getDataSource()
    const userRepository = dataSource.getRepository(User)

    const user = await userRepository.findOne({
      where: { id: payload.userId, isActive: true },
    })

    return user || null
  } catch (error) {
    console.error("Auth middleware error:", error)
    return null
  }
}

export async function requireAuth(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    return handler(request, user)
  }
}

export async function requireAdmin(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthenticatedUser(request)
    if (!user || !user.isAdmin) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
    return handler(request, user)
  }
}
