import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  ParseIntPipe,
  Logger 
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
  private readonly logger = new Logger(LessonsController.name);

  constructor(private lessonsService: LessonsService) {}

  @Get()
  async findAll() {
    try {
      this.logger.log('Fetching all lessons');
      return await this.lessonsService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch lessons', error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.log(`Fetching lesson with id: ${id}`);
      return await this.lessonsService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fetch lesson: ${id}`, error.stack);
      throw error;
    }
  }

  @Get('module/:moduleId')
  async findByModule(@Param('moduleId', ParseIntPipe) moduleId: number) {
    try {
      this.logger.log(`Fetching lessons for module: ${moduleId}`);
      return await this.lessonsService.findByModule(moduleId);
    } catch (error) {
      this.logger.error(`Failed to fetch lessons for module: ${moduleId}`, error.stack);
      throw error;
    }
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async create(@Body() createLessonDto: any, @CurrentUser() user: any) {
    try {
      this.logger.log(`Creating lesson by user: ${user.email}`);
      return await this.lessonsService.create(createLessonDto, user);
    } catch (error) {
      this.logger.error(`Failed to create lesson by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateLessonDto: any, 
    @CurrentUser() user: any
  ) {
    try {
      this.logger.log(`Updating lesson ${id} by user: ${user.email}`);
      return await this.lessonsService.update(id, updateLessonDto, user);
    } catch (error) {
      this.logger.error(`Failed to update lesson ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Deleting lesson ${id} by user: ${user.email}`);
      await this.lessonsService.remove(id);
      return { message: 'Lesson deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete lesson ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }
}
