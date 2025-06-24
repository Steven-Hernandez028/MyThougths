import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique
} from "typeorm"
import type { Relation } from "typeorm"

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

  @ManyToOne("User", "readingProgress", { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Relation<any>

  @Column()
  userId: string

  @ManyToOne("Book", "readingProgress", { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookId" })
  book: Relation<any>

  @Column()
  bookId: string
}
