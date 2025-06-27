import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './result.entity';
import { User, UserRole } from '../users/user.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findByStudent(studentId: number): Promise<Result[]> {
    try {
      return await this.resultsRepository.find({ 
        where: { student: { id: studentId } }, 
        relations: ['assignment', 'assignment.module', 'assignment.module.course'] 
      });
    } catch (error) {
      this.logger.error(`Failed to find results for student: ${studentId}`, error.stack);
      throw error;
    }
  }

  async findByCourse(courseId: number, user: User): Promise<Result[]> {
    try {
      // Check if user has permission to view results for this course
      const course = await this.coursesRepository.findOne({
        where: { id: courseId },
        relations: ['teacher']
      });

      if (!course) {
        throw new Error('Course not found');
      }

      if (user.role !== UserRole.ADMIN && course.teacher.id !== user.id) {
        throw new ForbiddenException('You can only view results for your own courses');
      }

      // Get all assignments for this course and create results
      const assignments = await this.assignmentsRepository.find({
        where: { module: { course: { id: courseId } } },
        relations: ['student', 'module', 'module.course']
      });

      // Convert assignments to results format
      const results = assignments.map(assignment => ({
        id: assignment.id,
        student: assignment.student,
        assignment: assignment,
        grade: assignment.grade,
        course: assignment.module.course,
        module: assignment.module
      }));

      this.logger.log(`Results fetched for course ${courseId} by user: ${user.email}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to find results for course ${courseId} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  async calculateStudentProgress(studentId: number): Promise<any> {
    try {
      const assignments = await this.assignmentsRepository.find({
        where: { student: { id: studentId } },
        relations: ['module', 'module.course']
      });

      const totalAssignments = assignments.length;
      const gradedAssignments = assignments.filter(a => a.grade !== null).length;
      const averageGrade = assignments.length > 0 
        ? assignments.reduce((sum, a) => sum + (a.grade || 0), 0) / assignments.length 
        : 0;

      const progress = {
        totalAssignments,
        gradedAssignments,
        averageGrade: Math.round(averageGrade * 100) / 100,
        completionRate: totalAssignments > 0 ? (gradedAssignments / totalAssignments) * 100 : 0
      };

      this.logger.log(`Progress calculated for student: ${studentId}`);
      return progress;
    } catch (error) {
      this.logger.error(`Failed to calculate progress for student: ${studentId}`, error.stack);
      throw error;
    }
  }
}
