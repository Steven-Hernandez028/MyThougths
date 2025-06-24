import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm"
import { User } from "./User"
import { Book } from "./Book"

@Entity("reading_progress")
@Unique(["userId", "bookId"])
export class ReadingProgress {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  chapterIndex: number

  @Column({ default: 0 })
  scrollPosition: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.readingProgress, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: string

  @ManyToOne(() => Book, (book) => book.readingProgress, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookId" })
  book: Book

  @Column()
  bookId: string
}
