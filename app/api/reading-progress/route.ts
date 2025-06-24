import { type NextRequest, NextResponse } from "next/server"
import { getDataSource } from "@/lib/db/data-source"
import { requireAuth } from "@/lib/auth/middleware"

// GET /api/reading-progress - Get user's reading progress
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const dataSource = await getDataSource()
    //const progressRepository = dataSource.getRepository(ReadingProgress)

    // const progress = await progressRepository.find({
    //   where: { userId: user.id },
    //   relations: ["book"],
    // })

    return NextResponse.json("")
  } catch (error) {
    console.error("Get reading progress error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// POST /api/reading-progress - Save reading progress
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { bookId, chapterIndex, scrollPosition } = await request.json()

    if (!bookId || chapterIndex === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const dataSource = await getDataSource()
    // const progressRepository = dataSource.getRepository(ReadingProgress)

    // Find existing progress or create new one
    // let progress = await progressRepository.findOne({
    //   where: { userId: user.id, bookId },
    // })

    // if (progress) {
    //   progress.chapterIndex = chapterIndex
    //   progress.scrollPosition = scrollPosition || 0
    // } else {
    //   progress = progressRepository.create({
    //     userId: user.id,
    //     bookId,
    //     chapterIndex,
    //     scrollPosition: scrollPosition || 0,
    //   })
    // }

    // await progressRepository.save(progress)
    return NextResponse.json("")
  } catch (error) {
    console.error("Save reading progress error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
