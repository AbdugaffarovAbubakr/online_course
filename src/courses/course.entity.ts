import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Module } from '../modules/module.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal', { nullable: true })
  price: number;

  @ManyToOne(() => User, (user) => user.courses)
  teacher: User;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  duration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];
} 