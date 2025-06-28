import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { User, UserRole } from '../users/user.entity';
import { Module } from '../modules/module.entity';
import { EntityNotFoundException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);

  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Module)
    private modulesRepository: Repository<Module>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Assignment[]> {
    try {
      return await this.assignmentsRepository.find({ 
        relations: ['module', 'student', 'module.course'] 
      });
    } catch (error) {
      this.logger.error('Failed to find all assignments', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Assignment> {
    try {
      const assignment = await this.assignmentsRepository.findOne({ 
        where: { id }, 
        relations: ['module', 'student', 'module.course'] 
      });
      if (!assignment) {
        throw new EntityNotFoundException('Assignment', id);
      }
      return assignment;
    } catch (error) {
      this.logger.error(`Failed to find assignment: ${id}`, error.stack);
      throw error;
    }
  }

  async findByModule(moduleId: number): Promise<Assignment[]> {
    try {
      return await this.assignmentsRepository.find({ 
        where: { module: { id: moduleId } }, 
        relations: ['module', 'student'] 
      });
    } catch (error) {
      this.logger.error(`Failed to find assignments for module: ${moduleId}`, error.stack);
      throw error;
    }
  }

  async findByStudent(studentId: number): Promise<Assignment[]> {
    try {
      return await this.assignmentsRepository.find({ 
        where: { student: { id: studentId } }, 
        relations: ['module', 'module.course'] 
      });
    } catch (error) {
      this.logger.error(`Failed to find assignments for student: ${studentId}`, error.stack);
      throw error;
    }
  }

  async submitAssignment(moduleId: number, studentId: number, fileUrl: string): Promise<Assignment> {
    try {
      const module = await this.modulesRepository.findOne({ where: { id: moduleId } });
      if (!module) {
        throw new EntityNotFoundException('Module', moduleId);
      }

      const student = await this.usersRepository.findOne({ where: { id: studentId } });
      if (!student) {
        throw new EntityNotFoundException('User', studentId);
      }

      const existingAssignment = await this.assignmentsRepository.findOne({
        where: { module: { id: moduleId }, student: { id: studentId } }
      });

      if (existingAssignment) {
        existingAssignment.fileUrl = fileUrl;
        existingAssignment.submittedAt = new Date();
        const updatedAssignment = await this.assignmentsRepository.save(existingAssignment);
        this.logger.log(`Assignment updated for student: ${student.email}, module: ${moduleId}`);
        return updatedAssignment;
      }

      const assignment = this.assignmentsRepository.create({ 
        module, 
        student, 
        fileUrl,
        submittedAt: new Date()
      });
      
      const savedAssignment = await this.assignmentsRepository.save(assignment);
      this.logger.log(`Assignment submitted for student: ${student.email}, module: ${moduleId}`);
      return savedAssignment;
    } catch (error) {
      this.logger.error(`Failed to submit assignment for student: ${studentId}, module: ${moduleId}`, error.stack);
      throw error;
    }
  }

  async gradeAssignment(id: number, grade: number, user: User): Promise<Assignment> {
    try {
      const assignment = await this.assignmentsRepository.findOne({
        where: { id },
        relations: ['module', 'module.course', 'module.course.teacher']
      });

      if (!assignment) {
        throw new EntityNotFoundException('Assignment', id);
      }

      if (user.role !== UserRole.ADMIN && user.role !== UserRole.TEACHER) {
        throw new ForbiddenException('Only admin or teacher can grade assignments');
      }

      assignment.grade = grade;
      assignment.gradedAt = new Date();
      assignment.gradedBy = user;

      const updatedAssignment = await this.assignmentsRepository.save(assignment);
      this.logger.log(`Assignment graded: ${id} by user: ${user.email}, grade: ${grade}`);
      return updatedAssignment;
    } catch (error) {
      this.logger.error(`Failed to grade assignment ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }
}
