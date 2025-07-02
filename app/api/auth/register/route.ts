import { type NextRequest, NextResponse } from "next/server"
import { getDataSource } from "@/lib/db/data-source"
import { User, UserRole } from "@/lib/entities/User"
import { hashPassword } from "@/lib/auth/password"
import { signToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const dataSource = await getDataSource()
    const userRepository = dataSource.getRepository(User)

    const existingUser = await userRepository.findOne({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const user = userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.USER,
    })

    await userRepository.save(user)

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Create response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    const userData = {
      ...userWithoutPassword,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
    }

    const response = NextResponse.json({ user: userData }, { status: 201 })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
