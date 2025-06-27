import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Module } from '../modules/module.entity';
import { User, UserRole } from '../users/user.entity';
import { EntityNotFoundException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class LessonsService {
  private readonly logger = new Logger(LessonsService.name);

  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Module)
    private modulesRepository: Repository<Module>,
  ) {}

  async findAll(): Promise<Lesson[]> {
    try {
      return await this.lessonsRepository.find({ relations: ['module'] });
    } catch (error) {
      this.logger.error('Failed to find all lessons', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Lesson> {
    try {
      const lesson = await this.lessonsRepository.findOne({ 
        where: { id }, 
        relations: ['module'] 
      });
      if (!lesson) {
        throw new EntityNotFoundException('Lesson', id);
      }
      return lesson;
    } catch (error) {
      this.logger.error(`Failed to find lesson: ${id}`, error.stack);
      throw error;
    }
  }

  async findByModule(moduleId: number): Promise<Lesson[]> {
    try {
      return await this.lessonsRepository.find({ 
        where: { module: { id: moduleId } }, 
        relations: ['module']
      });
    } catch (error) {
      this.logger.error(`Failed to find lessons for module: ${moduleId}`, error.stack);
      throw error;
    }
  }

  async create(createLessonDto: any, user: User): Promise<Lesson> {
    try {
      const { moduleId, ...lessonData } = createLessonDto;
      
      const module = await this.modulesRepository.findOne({ 
        where: { id: moduleId },
        relations: ['course', 'course.teacher']
      });
      if (!module) {
        throw new EntityNotFoundException('Module', moduleId);
      }

      if (user.role !== UserRole.ADMIN && module.course.teacher.id !== user.id) {
        throw new ForbiddenException('You can only create lessons for your own courses');
      }

      const lesson = this.lessonsRepository.create({
        ...lessonData,
        module
      });
      
      const savedLesson = await this.lessonsRepository.save(lesson);
      const lessonEntity = Array.isArray(savedLesson) ? savedLesson[0] : savedLesson;
      this.logger.log(`Lesson created: ${lessonEntity.id} by user: ${user.email}`);
      return lessonEntity;
    } catch (error) {
      this.logger.error(`Failed to create lesson by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateLessonDto: any, user: User): Promise<Lesson> {
    try {
      const lesson = await this.lessonsRepository.findOne({
        where: { id },
        relations: ['module', 'module.course', 'module.course.teacher']
      });
      
      if (!lesson) {
        throw new EntityNotFoundException('Lesson', id);
      }
      
      if (user.role !== UserRole.ADMIN && lesson.module.course.teacher.id !== user.id) {
        throw new ForbiddenException('You can only update lessons for your own courses');
      }

      Object.assign(lesson, updateLessonDto);
      const updatedLesson = await this.lessonsRepository.save(lesson);
      
      this.logger.log(`Lesson updated: ${id} by user: ${user.email}`);
      return updatedLesson;
    } catch (error) {
      this.logger.error(`Failed to update lesson ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const lesson = await this.findOne(id);
      await this.lessonsRepository.remove(lesson);
      this.logger.log(`Lesson deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete lesson: ${id}`, error.stack);
      throw error;
    }
  }
}
