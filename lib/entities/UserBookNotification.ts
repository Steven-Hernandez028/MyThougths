import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from "typeorm"
import { User } from "./User"
import { Book } from "./Book"

import type { Relation } from "typeorm"

@Entity("user_book_notifications")
@Unique(["user", "book"])
export class UserBookNotification {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User, (user) => user.bookNotifications, {
    onDelete: "CASCADE",
    eager: false,
  })
  @JoinColumn({ name: "user_id" })
  user: Relation<User>

  @ManyToOne(() => Book, (book) => book.userNotifications, {
    onDelete: "CASCADE",
    eager: false,
  })
  @JoinColumn({ name: "book_id" })
  book: Relation<Book>

@Column({ name: "receive_notifications", default: true })
  receiveNotifications: boolean

  @CreateDateColumn({name:'created_at'})
  createdAt: Date
  @Column()
  book_id: string;
  @Column()
  user_id: string;
}
