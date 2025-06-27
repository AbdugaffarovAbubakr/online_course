import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  ParseIntPipe,
  Logger 
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('enrollment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentController {
  private readonly logger = new Logger(EnrollmentController.name);

  constructor(private enrollmentService: EnrollmentService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findAll(@CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching all enrollments by user: ${user.email}`);
      return await this.enrollmentService.findAll();
    } catch (error) {
      this.logger.error(`Failed to fetch enrollments by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get('my-courses')
  @Roles(UserRole.STUDENT)
  async myCourses(@CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching courses for student: ${user.email}`);
      return await this.enrollmentService.findCoursesByStudent(user.id);
    } catch (error) {
      this.logger.error(`Failed to fetch courses for student: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findByCourse(@Param('courseId', ParseIntPipe) courseId: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching enrollments for course ${courseId} by user: ${user.email}`);
      return await this.enrollmentService.findByCourse(courseId, user);
    } catch (error) {
      this.logger.error(`Failed to fetch enrollments for course ${courseId} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Post()
  @Roles(UserRole.STUDENT)
  async enroll(@Body() body: { courseId: number }, @CurrentUser() user: any) {
    try {
      this.logger.log(`Enrolling student ${user.email} in course ${body.courseId}`);
      return await this.enrollmentService.enroll(user.id, body.courseId);
    } catch (error) {
      this.logger.error(`Failed to enroll student ${user.email} in course ${body.courseId}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.STUDENT)
  async unenroll(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Unenrolling student ${user.email} from enrollment ${id}`);
      await this.enrollmentService.unenroll(id, user.id);
      return { message: 'Successfully unenrolled from course' };
    } catch (error) {
      this.logger.error(`Failed to unenroll student ${user.email} from enrollment ${id}`, error.stack);
      throw error;
    }
  }
}
