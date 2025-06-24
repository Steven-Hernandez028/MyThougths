import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import type { Chapter } from "./Chapter"
import type { ReadingProgress } from "./ReadingProgress"

export enum BookStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column()
  author: string

  @Column()
  genre: string

  @Column("text")
  description: string

  @Column({ nullable: true })
  coverImage: string

  @Column({
    type: "enum",
    enum: BookStatus,
    default: BookStatus.DRAFT,
  })
  status: BookStatus

  @Column({ nullable: true })
  publishedDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany("Chapter", "book", { cascade: true })
  chapters: Chapter[]

  @OneToMany("ReadingProgress", "book")
  readingProgress: ReadingProgress[]

  // Virtual properties
  get isPublished(): boolean {
    return this.status === BookStatus.PUBLISHED
  }

  get isNew(): boolean {
    if (!this.publishedDate) return false
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    return this.publishedDate > twoDaysAgo
  }
}