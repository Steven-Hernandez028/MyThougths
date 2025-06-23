export interface Book {
  id: string
  title: string
  author: string
  genre: string
  description: string
  coverImage: string
  chapters: Chapter[]
  status: "draft" | "published"
  publishedDate?: string
  createdDate: string
}

export interface Chapter {
  id: string
  title: string
  content: string
}

export interface ReadingProgress {
  bookId: string
  chapterIndex: number
  scrollPosition: number
  lastRead: string
}
