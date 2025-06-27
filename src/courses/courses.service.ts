import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { User } from '../users/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EntityNotFoundException, InsufficientPermissionsException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(courseData: CreateCourseDto, teacher: User): Promise<Course> {
    try {
      // Check if user has permission to create courses
      if (teacher.role !== 'admin' && teacher.role !== 'teacher') {
        throw new InsufficientPermissionsException('create courses', 'admin or teacher');
      }

      const course = this.coursesRepository.create({ ...courseData, teacher });
      const savedCourse = await this.coursesRepository.save(course);
      
      this.logger.log(`Course created: ${savedCourse.title} by ${teacher.email}`);
      return savedCourse;
    } catch (error) {
      this.logger.error(`Failed to create course by ${teacher.email}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Course[]> {
    try {
      return await this.coursesRepository.find({ 
        relations: ['teacher'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error('Failed to find all courses', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Course> {
    try {
      const course = await this.coursesRepository.findOne({ 
        where: { id }, 
        relations: ['teacher', 'modules'] 
      });
      
      if (!course) {
        throw new EntityNotFoundException('Course', id);
      }
      
      return course;
    } catch (error) {
      this.logger.error(`Failed to find course: ${id}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateCourseDto, user: User): Promise<Course> {
    try {
      const course = await this.findOne(id);
      
      // Check if user has permission to update this course
      if (user.role !== 'admin' && course.teacher.id !== user.id) {
        throw new InsufficientPermissionsException('update this course', 'admin or course owner');
      }

      Object.assign(course, data);
      const updatedCourse = await this.coursesRepository.save(course);
      
      this.logger.log(`Course updated: ${id} by ${user.email}`);
      return updatedCourse;
    } catch (error) {
      this.logger.error(`Failed to update course ${id} by ${user.email}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const course = await this.findOne(id);
      await this.coursesRepository.remove(course);
      
      this.logger.log(`Course deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete course: ${id}`, error.stack);
      throw error;
    }
  }

  async findByTeacher(teacherId: number): Promise<Course[]> {
    try {
      return await this.coursesRepository.find({ 
        where: { teacher: { id: teacherId } },
        relations: ['teacher'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`Failed to find courses by teacher: ${teacherId}`, error.stack);
      throw error;
    }
  }
}
