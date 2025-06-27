import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  HttpCode, 
  ParseIntPipe,
  Logger 
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  private readonly logger = new Logger(CoursesController.name);

  constructor(private coursesService: CoursesService) {}

  @Get()
  async findAll() {
    try {
      this.logger.log('Fetching all courses');
      return await this.coursesService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch courses', error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.log(`Fetching course with id: ${id}`);
      return await this.coursesService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fetch course: ${id}`, error.stack);
      throw error;
    }
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async create(@Body() createCourseDto: CreateCourseDto, @CurrentUser() user: any) {
    try {
      this.logger.log(`Creating course by user: ${user.email}`);
      return await this.coursesService.create(createCourseDto, user);
    } catch (error) {
      this.logger.error(`Failed to create course by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCourseDto: UpdateCourseDto, 
    @CurrentUser() user: any
  ) {
    try {
      this.logger.log(`Updating course ${id} by user: ${user.email}`);
      return await this.coursesService.update(id, updateCourseDto, user);
    } catch (error) {
      this.logger.error(`Failed to update course ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Deleting course ${id} by user: ${user.email}`);
      await this.coursesService.remove(id);
    } catch (error) {
      this.logger.error(`Failed to delete course ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }
}
