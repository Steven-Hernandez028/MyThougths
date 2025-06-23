import { type NextRequest, NextResponse } from "next/server"
import { getDataSource } from "@/lib/db/data-source"
import { Book, BookStatus } from "@/lib/entities/Book"
import { Chapter } from "@/lib/entities/Chapter"
import { requireAdmin, getAuthenticatedUser } from "@/lib/auth/middleware"

// GET /api/books/[id] - Get single book
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dataSource = await getDataSource()
    const bookRepository = dataSource.getRepository(Book)

    const user = await getAuthenticatedUser(request)

    const book = await bookRepository.findOne({
      where: { id: params.id },
      relations: ["chapters"],
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if user can access this book
    if (book.status === BookStatus.DRAFT && (!user || !user.isAdmin)) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Sort chapters by order
    book.chapters.sort((a, b) => a.order - b.order)

    return NextResponse.json(book)
  } catch (error) {
    console.error("Get book error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/books/[id] - Update book (admin only)
export const PUT = requireAdmin(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const { title, author, genre, description, coverImage, status, chapters } = await request.json()

    const dataSource = await getDataSource()
    const bookRepository = dataSource.getRepository(Book)
    const chapterRepository = dataSource.getRepository(Chapter)

    const book = await bookRepository.findOne({
      where: { id: params.id },
      relations: ["chapters"],
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Update book properties
    book.title = title
    book.author = author
    book.genre = genre
    book.description = description
    book.coverImage = coverImage

    // Handle status change
    if (status !== book.status) {
      book.status = status
      if (status === BookStatus.PUBLISHED && !book.publishedDate) {
        book.publishedDate = new Date()
      }
    }

    await bookRepository.save(book)

    // Update chapters - delete existing and create new ones
    await chapterRepository.delete({ bookId: book.id })

    if (chapters && chapters.length > 0) {
      const chapterEntities = chapters.map((chapter: any, index: number) =>
        chapterRepository.create({
          title: chapter.title,
          content: chapter.content,
          order: index,
          bookId: book.id,
        }),
      )
      await chapterRepository.save(chapterEntities)
    }

    // Return updated book with chapters
    const updatedBook = await bookRepository.findOne({
      where: { id: book.id },
      relations: ["chapters"],
    })

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error("Update book error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// DELETE /api/books/[id] - Delete book (admin only)
export const DELETE = requireAdmin(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const dataSource = await getDataSource()
    const bookRepository = dataSource.getRepository(Book)

    const book = await bookRepository.findOne({ where: { id: params.id } })
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    await bookRepository.remove(book)
    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Delete book error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
