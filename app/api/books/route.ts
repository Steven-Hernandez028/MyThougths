import { type NextRequest, NextResponse } from "next/server"
import { getDataSource } from "@/lib/db/data-source"
import { Book, BookStatus } from "@/lib/entities/Book"
import { Chapter } from "@/lib/entities/Chapter"
import { requireAdmin, getAuthenticatedUser } from "@/lib/auth/middleware"

// GET /api/books - Get all published books (public) or all books (admin)
export async function GET(request: NextRequest) {
  try {
    const dataSource = await getDataSource()
    const bookRepository = dataSource.getRepository(Book)

    const user = await getAuthenticatedUser(request)

    let books: Book[]

    if (user?.isAdmin) {
      // Admin can see all books
      books = await bookRepository.find({
        relations: ["chapters"],
        order: { createdAt: "DESC" },
      })
    } else {
      // Public users only see published books
      books = await bookRepository.find({
        where: { status: BookStatus.PUBLISHED },
        relations: ["chapters"],
        order: { publishedDate: "DESC" },
      })
    }

    return NextResponse.json(books)
  } catch (error) {
    console.error("Get books error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/books - Create new book (admin only)
export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {
    const { title, author, genre, description, coverImage, status, chapters } = await request.json()

    if (!title || !author || !genre || !chapters || chapters.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const dataSource = await getDataSource()
    const bookRepository = dataSource.getRepository(Book)
    const chapterRepository = dataSource.getRepository(Chapter)

    // Create book
    const book = bookRepository.create({
      title,
      author,
      genre,
      description,
      coverImage,
      status: status || BookStatus.DRAFT,
      publishedDate: status === BookStatus.PUBLISHED ? new Date() : null,
    })

    const savedBook = await bookRepository.save(book)

    // Create chapters
    const chapterEntities = chapters.map((chapter: any, index: number) =>
      chapterRepository.create({
        title: chapter.title,
        content: chapter.content,
        order: index,
        bookId: savedBook.id,
      }),
    )

    await chapterRepository.save(chapterEntities)

    // Return book with chapters
    const bookWithChapters = await bookRepository.findOne({
      where: { id: savedBook.id },
      relations: ["chapters"],
    })

    return NextResponse.json(bookWithChapters, { status: 201 })
  } catch (error) {
    console.error("Create book error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
