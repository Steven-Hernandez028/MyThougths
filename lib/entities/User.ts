import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm"
import { ReadingProgress } from "./ReadingProgress"

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => ReadingProgress, (readingProgress) => readingProgress.user)
  readingProgress: ReadingProgress[]

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN
  }
}
