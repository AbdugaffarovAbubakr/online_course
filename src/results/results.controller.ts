import { 
  Controller, 
  Get, 
  Param, 
  UseGuards, 
  ParseIntPipe,
  Logger 
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultsController {
  private readonly logger = new Logger(ResultsController.name);

  constructor(private resultsService: ResultsService) {}

  @Get()
  @Roles(UserRole.STUDENT)
  async findByStudent(@CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching results for student: ${user.email}`);
      return await this.resultsService.findByStudent(user.id);
    } catch (error) {
      this.logger.error(`Failed to fetch results for student: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findByCourse(@Param('courseId', ParseIntPipe) courseId: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching results for course ${courseId} by user: ${user.email}`);
      return await this.resultsService.findByCourse(courseId, user);
    } catch (error) {
      this.logger.error(`Failed to fetch results for course ${courseId} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async findByStudentId(@Param('studentId', ParseIntPipe) studentId: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Fetching results for student ${studentId} by user: ${user.email}`);
      return await this.resultsService.findByStudent(studentId);
    } catch (error) {
      this.logger.error(`Failed to fetch results for student ${studentId} by user: ${user.email}`, error.stack);
      throw error;
    }
  }
}
