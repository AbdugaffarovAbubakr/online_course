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
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModulesController {
  private readonly logger = new Logger(ModulesController.name);

  constructor(private modulesService: ModulesService) {}

  @Get()
  async findAll() {
    try {
      this.logger.log('Fetching all modules');
      return await this.modulesService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch modules', error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.log(`Fetching module with id: ${id}`);
      return await this.modulesService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fetch module: ${id}`, error.stack);
      throw error;
    }
  }

  @Get('course/:courseId')
  async findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    try {
      this.logger.log(`Fetching modules for course: ${courseId}`);
      return await this.modulesService.findByCourse(courseId);
    } catch (error) {
      this.logger.error(`Failed to fetch modules for course: ${courseId}`, error.stack);
      throw error;
    }
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async create(@Body() createModuleDto: any, @CurrentUser() user: any) {
    try {
      this.logger.log(`Creating module by user: ${user.email}`);
      return await this.modulesService.create(createModuleDto, user);
    } catch (error) {
      this.logger.error(`Failed to create module by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateModuleDto: any, 
    @CurrentUser() user: any
  ) {
    try {
      this.logger.log(`Updating module ${id} by user: ${user.email}`);
      return await this.modulesService.update(id, updateModuleDto, user);
    } catch (error) {
      this.logger.error(`Failed to update module ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Deleting module ${id} by user: ${user.email}`);
      await this.modulesService.remove(id);
      return { message: 'Module deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete module ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }
}
