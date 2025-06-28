import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { User, UserRole } from '../users/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EntityNotFoundException, InsufficientPermissionsException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(courseData: CreateCourseDto, admin: User): Promise<Course> {
    try {
      if (admin.role !== UserRole.ADMIN) {
        throw new InsufficientPermissionsException('create courses', 'admin only');
      }

      const teacher = await this.usersRepository.findOne({ 
        where: { id: courseData.teacherId, role: UserRole.TEACHER } 
      });
      
      if (!teacher) {
        throw new EntityNotFoundException('Teacher', courseData.teacherId);
      }

      const { teacherId, ...courseDataWithoutTeacherId } = courseData;
      const course = this.coursesRepository.create({ 
        ...courseDataWithoutTeacherId, 
        teacher 
      });
      
      const savedCourse = await this.coursesRepository.save(course);
      
      this.logger.log(`Course created: ${savedCourse.title} by admin ${admin.email}, assigned to teacher ${teacher.email}`);
      return savedCourse;
    } catch (error) {
      this.logger.error(`Failed to create course by admin ${admin.email}`, error.stack);
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
      
      if (user.role !== 'admin' && course.teacher.id !== user.id) {
        throw new InsufficientPermissionsException('update this course', 'admin or assigned teacher');
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

  async findAssignedCourses(teacherId: number): Promise<Course[]> {
    try {
      return await this.coursesRepository.find({ 
        where: { teacher: { id: teacherId } },
        relations: ['teacher', 'modules'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`Failed to find assigned courses for teacher: ${teacherId}`, error.stack);
      throw error;
    }
  }
}
