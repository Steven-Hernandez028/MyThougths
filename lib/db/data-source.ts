import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entities/User"
import { Book } from "../entities/Book"
import { Chapter } from "../entities/Chapter"
import { ReadingProgress } from "../entities/ReadingProgress"

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://postgres:KnTPcjoLwwSJTkFjcbkBYQoxANTCkYZP@postgres.railway.internal:5432/railway",
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === "development",
  entities: [User, Book, Chapter, ReadingProgress],
  migrations: [],
  subscribers: [],
})

let isInitialized = false

export async function initializeDatabase() {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize()
      isInitialized = true
      console.log("Database connection initialized")
    } catch (error) {
      console.error("Error during Data Source initialization:", error)
      throw error
    }
  }
  return AppDataSource
}

export async function getDataSource() {
  if (!isInitialized) {
    await initializeDatabase()
  }
  return AppDataSource
}
