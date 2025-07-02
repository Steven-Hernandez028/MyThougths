import { type NextRequest, NextResponse } from "next/server"
import { getDataSource } from "@/lib/db/data-source"
import { Book, BookStatus } from "@/lib/entities/Book"
import { Chapter } from "@/lib/entities/Chapter"
import { getAuthenticatedUser } from "@/lib/auth/middleware"
import { In, Repository } from "typeorm"
import { UserBookNotification } from "@/lib/entities/UserBookNotification"

interface BookUpdateData {
  title: string
  author: string
  genre: string
  description: string
  coverImage: string
  status: BookStatus
  chapters?: Array<{
    title: string
    content: string
  }>
}

interface RouteParams {
  params: { id: string }
}

class BookService {
  private bookRepository: Repository<Book>
  private chapterRepository: Repository<Chapter>

  constructor(bookRepo: Repository<Book>, chapterRepo: Repository<Chapter>) {
    this.bookRepository = bookRepo
    this.chapterRepository = chapterRepo
  }

  async findBookById(id: string): Promise<Book | null> {
    return await this.bookRepository.findOne({
      where: { id },
      relations: ["chapters"],
    })
  }

  async canUserAccessBook(book: Book, user: any): Promise<boolean> {
    if (book.status === BookStatus.DRAFT) {
      return user && user.isAdmin
    }
    return true
  }

  async updateBook(book: Book, updateData: BookUpdateData): Promise<Book | null> {
    // Update book properties
    Object.assign(book, {
      title: updateData.title,
      author: updateData.author,
      genre: updateData.genre,
      description: updateData.description,
      coverImage: updateData.coverImage,
    })

    // Handle status change
    if (updateData.status !== book.status) {
      book.status = updateData.status
      if (updateData.status === BookStatus.PUBLISHED && !book.publishedDate) {
        book.publishedDate = new Date()
      }
    }

    await this.bookRepository.save(book)

    // Update chapters
    if (updateData.chapters) {
      await this.updateBookChapters(book,book.id, updateData.chapters)
    }

    return await this.findBookById(book.id)
  }
  private async updateBookChapters(book : Book, bookId: string, chapters: Array<{ title: string; content: string }>) {
    const existingChapters = await this.chapterRepository.find({ where: { bookId } })
    const previousChapterCount = existingChapters.length

    await this.chapterRepository.delete({ bookId })

    if (chapters.length > 0) {
      const chapterEntities = chapters.map((chapter, index) =>
        this.chapterRepository.create({
          title: chapter.title,
          content: chapter.content,
          order: index,
          bookId,
        })
      )
      await this.chapterRepository.save(chapterEntities)
    }

    if (chapters.length > previousChapterCount) {
      await this.sendNotificationsToSubscribers(book,bookId)
    }
  }

private async sendNotificationsToSubscribers(book: Book,bookId: string) {
  const dataSource = await getDataSource()
  const notificationRepo = dataSource.getRepository(UserBookNotification)

  const notifications = await notificationRepo.find({
    where: { book_id: bookId, receiveNotifications: true },
    relations: ["user"], 
  })


  const payloads = notifications
    .filter(n => !!n.user.susbcription)
    .map(n => ({
      subscription: JSON.parse(n.user.susbcription),
      payload: {
        title: `Nuevo capítulo disponible en ${book.title}`,
        body: "Uno de los libros que sigues ha sido actualizado.",
        data: {
            url: `https://mythougths.up.railway.app/book/${bookId}`
        },
        icon: "/icon.png",
      },
    }))

  const { sendBulkNotifications } = await import('@/app/actions')
  await sendBulkNotifications(payloads)
}


  async deleteBook(id: string): Promise<boolean> {
    const book = await this.bookRepository.findOne({ where: { id } })
    if (!book) {
      return false
    }

    await this.bookRepository.remove(book)
    return true
  }

  sortChaptersByOrder(book: Book): void {
    book.chapters.sort((a, b) => a.order - b.order)
  }
}

// Utility functions
async function createBookService(): Promise<BookService> {
  const dataSource = await getDataSource()
  const bookRepository = dataSource.getRepository(Book)
  const chapterRepository = dataSource.getRepository(Chapter)
  return new BookService(bookRepository, chapterRepository)
}

function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

// Route Handlers
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const bookService = await createBookService()
    const user = await getAuthenticatedUser(request)

    const book = await bookService.findBookById(params.id)
    if (!book) {
      return createErrorResponse("Book not found", 404)
    }

    if (!bookService.canUserAccessBook(book, user)) {
      return createErrorResponse("Book not found", 404)
    }

    bookService.sortChaptersByOrder(book)
    return createSuccessResponse(book)

  } catch (error) {
    console.error("Get book error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Validate admin access first
    const user = await getAuthenticatedUser(request)
    if (!user || !user.isAdmin) {
      return createErrorResponse("Unauthorized", 401)
    }

    const updateData: BookUpdateData = await request.json()
    const bookService = await createBookService()

    const book = await bookService.findBookById(params.id)
    if (!book) {
      return createErrorResponse("Book not found", 404)
    }

    const updatedBook = await bookService.updateBook(book, updateData)
    return createSuccessResponse(updatedBook)

  } catch (error) {
    console.error("Update book error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Validate admin access first
    const user = await getAuthenticatedUser(request)
    if (!user || !user.isAdmin) {
      return createErrorResponse("Unauthorized", 401)
    }

    const bookService = await createBookService()
    const deleted = await bookService.deleteBook(params.id)

    if (!deleted) {
      return createErrorResponse("Book not found", 404)
    }

    return createSuccessResponse({ message: "Book deleted successfully" })

  } catch (error) {
    console.error("Delete book error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}