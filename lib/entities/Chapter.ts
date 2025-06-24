import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn
} from "typeorm"
import type { Relation } from "typeorm"
import { Book } from "./Book"

@Entity("chapters")
export class Chapter {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column("text")
  content: string

  @Column()
  order: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Book, (book) => book.chapters, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookId" })
  book: Relation<Book> // usar 'any' o mantener 'Book' si no hay importación directa

  @Column()
  bookId: string
}
