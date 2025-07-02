

export interface Book {
  id: string
  title: string
  author: string
  genre: string
  description: string
  coverImage: string
  chapters: Chapter[]
  notification : boolean;
  createdAt: Date
  status: "draft" | "published"
  publishedDate?: Date
}

export interface Chapter {
  id: string
  title: string
  content: string
}

// Renamed from ReadingProgress to avoid TypeORM confusion
export interface BookReadingProgress {
  bookId: string
  chapterIndex: number
  scrollPosition: number
  lastRead: string
}