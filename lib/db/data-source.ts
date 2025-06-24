import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entities/User"
import { Chapter } from "../entities/Chapter"
import { Book } from "../entities/Book"

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL!,
  synchronize: false, // Set to false in production
  logging: true,
  entities: [Book, Chapter, User], // ✅ Incluye todos aquí
  migrations: [],
  subscribers: [],
})

let isInitialized = false

export async function initializeDatabase() {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize()
      isInitialized = true
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
