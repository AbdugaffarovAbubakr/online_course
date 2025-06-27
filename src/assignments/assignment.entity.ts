import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Module } from '../modules/module.entity';
import { User } from '../users/user.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Module, { onDelete: 'CASCADE' })
  module: Module;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  student: User;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  grade: number;

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  gradedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  gradedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 