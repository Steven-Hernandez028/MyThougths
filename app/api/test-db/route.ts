// app/api/test-db/route.ts
import { NextResponse } from "next/server"
import { getDataSource } from "@/lib/db/data-source"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const ds = await getDataSource()
    const result = await ds.query("SELECT 1+1 as result")
    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error("DB Test Error:", err)
    return NextResponse.json({ error: "DB connection failed" }, { status: 500 })
  }
}
