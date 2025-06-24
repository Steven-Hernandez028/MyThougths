import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany
} from "typeorm"
import type { Relation } from "typeorm"

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

  @OneToMany("ReadingProgress", "user")
  readingProgress: Relation<any>[]

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN
  }
}
