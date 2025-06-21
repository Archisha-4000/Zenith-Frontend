import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/services/userService"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email,chosen_role } = body
    
    if (!email || !chosen_role) {
      return NextResponse.json(
        { error: "Email and Role is required" },
        { status: 400 }
      )
    }

    const user = await getUserByEmail(email)
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.role !== chosen_role) {
        return NextResponse.json(
        { error: "YOU chose wronggggggg" },
        { status: 403 }
      )
    }

    return NextResponse.json({success:true }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
