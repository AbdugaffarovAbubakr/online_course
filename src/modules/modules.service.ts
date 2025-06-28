import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module as CourseModule } from './module.entity';
import { Course } from '../courses/course.entity';
import { User, UserRole } from '../users/user.entity';
import { EntityNotFoundException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);

  constructor(
    @InjectRepository(CourseModule)
    private modulesRepository: Repository<CourseModule>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<CourseModule[]> {
    try {
      return await this.modulesRepository.find({ relations: ['course'] });
    } catch (error) {
      this.logger.error('Failed to find all modules', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<CourseModule> {
    try {
      const module = await this.modulesRepository.findOne({ 
        where: { id }, 
        relations: ['course'] 
      });
      if (!module) {
        throw new EntityNotFoundException('Module', id);
      }
      return module;
    } catch (error) {
      this.logger.error(`Failed to find module: ${id}`, error.stack);
      throw error;
    }
  }

  async findByCourse(courseId: number): Promise<CourseModule[]> {
    try {
      return await this.modulesRepository.find({ 
        where: { course: { id: courseId } }, 
        relations: ['course'],
        order: { id: 'ASC' }
      });
    } catch (error) {
      this.logger.error(`Failed to find modules for course: ${courseId}`, error.stack);
      throw error;
    }
  }

  async create(createModuleDto: any, user: User): Promise<CourseModule> {
    try {
      const { courseId, ...moduleData } = createModuleDto;
      
      const course = await this.coursesRepository.findOne({ 
        where: { id: courseId },
        relations: ['teacher']
      });
      if (!course) {
        throw new EntityNotFoundException('Course', courseId);
      }

      if (user.role !== UserRole.ADMIN && course.teacher.id !== user.id) {
        throw new ForbiddenException('You can only create modules for your own courses');
      }

      const module = this.modulesRepository.create({
        ...moduleData,
        course
      });
      
      const savedModule = await this.modulesRepository.save(module);
      this.logger.log(`Module created: ${(savedModule as unknown as CourseModule).id ?? '[unknown id]'} by user: ${user.email}`);
      return savedModule as unknown as CourseModule;
    } catch (error) {
      this.logger.error(`Failed to create module by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateModuleDto: any, user: User): Promise<CourseModule> {
    try {
      const module = await this.modulesRepository.findOne({
        where: { id },
        relations: ['course', 'course.teacher']
      });
      
      if (!module) {
        throw new EntityNotFoundException('Module', id);
      }
      
      if (user.role !== UserRole.ADMIN && module.course.teacher.id !== user.id) {
        throw new ForbiddenException('You can only update modules for your own courses');
      }

      Object.assign(module, updateModuleDto);
      const updatedModule = await this.modulesRepository.save(module);
      
      this.logger.log(`Module updated: ${id} by user: ${user.email}`);
      return updatedModule;
    } catch (error) {
      this.logger.error(`Failed to update module ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const module = await this.findOne(id);
      await this.modulesRepository.remove(module);
      this.logger.log(`Module deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete module: ${id}`, error.stack);
      throw error;
    }
  }
}
