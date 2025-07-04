import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany
} from "typeorm"
import { Chapter } from "./Chapter"

import type { Relation } from "typeorm"
import { UserBookNotification } from "./UserBookNotification"

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

  @OneToMany(() => Chapter, (chapter) => chapter.book, { cascade: true })
  chapters: Relation<Chapter>[]

  @OneToMany(() => UserBookNotification, (ubn) => ubn.book)
  userNotifications: Relation<UserBookNotification>[]


  get isPublished(): boolean {
    return this.status === BookStatus.PUBLISHED
  }

  get isNew(): boolean {
    if (!this.publishedDate) return false
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    return this.publishedDate > twoDaysAgo
  }
}
