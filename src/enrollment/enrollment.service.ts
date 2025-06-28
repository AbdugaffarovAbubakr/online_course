import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User, UserRole } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { EntityNotFoundException, DuplicateEntityException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class EnrollmentService {
  private readonly logger = new Logger(EnrollmentService.name);

  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Enrollment[]> {
    try {
      return await this.enrollmentRepository.find({ 
        relations: ['student', 'course', 'course.teacher'] 
      });
    } catch (error) {
      this.logger.error('Failed to find all enrollments', error.stack);
      throw error;
    }
  }

  async findByCourse(courseId: number, user: User): Promise<Enrollment[]> {
    try {
      const course = await this.coursesRepository.findOne({
        where: { id: courseId },
        relations: ['teacher']
      });

      if (!course) {
        throw new EntityNotFoundException('Course', courseId);
      }

      if (user.role !== UserRole.ADMIN && course.teacher.id !== user.id) {
        throw new ForbiddenException('You can only view enrollments for your own courses');
      }

      return await this.enrollmentRepository.find({ 
        where: { course: { id: courseId } }, 
        relations: ['student', 'course'] 
      });
    } catch (error) {
      this.logger.error(`Failed to find enrollments for course ${courseId} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  async enroll(studentId: number, courseId: number): Promise<Enrollment> {
    try {
      const student = await this.usersRepository.findOne({ where: { id: studentId } });
      if (!student) {
        throw new EntityNotFoundException('User', studentId);
      }

      const course = await this.coursesRepository.findOne({ where: { id: courseId } });
      if (!course) {
        throw new EntityNotFoundException('Course', courseId);
      }

      const existingEnrollment = await this.enrollmentRepository.findOne({ 
        where: { student: { id: studentId }, course: { id: courseId } } 
      });
      
      if (existingEnrollment) {
        throw new DuplicateEntityException('Enrollment', 'student-course combination', `${studentId}-${courseId}`);
      }

      const enrollment = this.enrollmentRepository.create({ student, course });
      const savedEnrollment = await this.enrollmentRepository.save(enrollment);
      
      this.logger.log(`Student ${student.email} enrolled in course ${course.title}`);
      return savedEnrollment;
    } catch (error) {
      this.logger.error(`Failed to enroll student ${studentId} in course ${courseId}`, error.stack);
      throw error;
    }
  }

  async unenroll(enrollmentId: number, studentId: number): Promise<void> {
    try {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { id: enrollmentId },
        relations: ['student', 'course']
      });

      if (!enrollment) {
        throw new EntityNotFoundException('Enrollment', enrollmentId);
      }

      if (enrollment.student.id !== studentId) {
        throw new ForbiddenException('You can only unenroll from your own enrollments');
      }

      await this.enrollmentRepository.remove(enrollment);
      this.logger.log(`Student ${enrollment.student.email} unenrolled from course ${enrollment.course.title}`);
    } catch (error) {
      this.logger.error(`Failed to unenroll student ${studentId} from enrollment ${enrollmentId}`, error.stack);
      throw error;
    }
  }

  async findCoursesByStudent(studentId: number): Promise<Enrollment[]> {
    try {
      return await this.enrollmentRepository.find({ 
        where: { student: { id: studentId } }, 
        relations: ['course', 'course.teacher'] 
      });
    } catch (error) {
      this.logger.error(`Failed to find courses for student: ${studentId}`, error.stack);
      throw error;
    }
  }

  async isEnrolled(studentId: number, courseId: number): Promise<boolean> {
    try {
      const found = await this.enrollmentRepository.findOne({ 
        where: { student: { id: studentId }, course: { id: courseId } } 
      });
      return !!found;
    } catch (error) {
      this.logger.error(`Failed to check enrollment for student ${studentId} in course ${courseId}`, error.stack);
      throw error;
    }
  }
}
