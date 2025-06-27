import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  UseGuards, 
  ParseIntPipe,
  Logger 
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  private readonly logger = new Logger(AssignmentsController.name);

  constructor(private assignmentsService: AssignmentsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findAll(@CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching all assignments by user: ${user.email}`);
      return await this.assignmentsService.findAll();
    } catch (error) {
      this.logger.error(`Failed to fetch assignments by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching assignment ${id} by user: ${user.email}`);
      return await this.assignmentsService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fetch assignment ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get('module/:moduleId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findByModule(@Param('moduleId', ParseIntPipe) moduleId: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching assignments for module ${moduleId} by user: ${user.email}`);
      return await this.assignmentsService.findByModule(moduleId);
    } catch (error) {
      this.logger.error(`Failed to fetch assignments for module ${moduleId} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get('student/me')
  @Roles(UserRole.STUDENT)
  async findMyAssignments(@CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching assignments for student: ${user.email}`);
      return await this.assignmentsService.findByStudent(user.id);
    } catch (error) {
      this.logger.error(`Failed to fetch assignments for student: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Post('module/:moduleId')
  @Roles(UserRole.STUDENT)
  async submit(
    @Param('moduleId', ParseIntPipe) moduleId: number, 
    @Body() body: { fileUrl: string }, 
    @CurrentUser() user: any
  ) {
    try {
      this.logger.log(`Submitting assignment for module ${moduleId} by student: ${user.email}`);
      return await this.assignmentsService.submitAssignment(moduleId, user.id, body.fileUrl);
    } catch (error) {
      this.logger.error(`Failed to submit assignment for module ${moduleId} by student: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Put(':id/grade')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async grade(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: { grade: number }, 
    @CurrentUser() user: any
  ) {
    try {
      this.logger.log(`Grading assignment ${id} by user: ${user.email}`);
      return await this.assignmentsService.gradeAssignment(id, body.grade, user);
    } catch (error) {
      this.logger.error(`Failed to grade assignment ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }
}
