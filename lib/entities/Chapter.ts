import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Book } from "./Book" // Importación normal, no solo tipo

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

  @ManyToOne(() => Book, (book) => book.chapters, { onDelete: "CASCADE" }) // Función flecha que retorna la clase
  @JoinColumn({ name: "bookId" })
  book: Book

  @Column()
  bookId: string
}
