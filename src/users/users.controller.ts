import { 
  Controller, 
  Get, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  ParseIntPipe,
  Logger 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    try {
      this.logger.log('Fetching all users');
      return await this.usersService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack);
      throw error;
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.log(`Fetching user with id: ${id}`);
      return await this.usersService.findById(id);
    } catch (error) {
      this.logger.error(`Failed to fetch user: ${id}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateData: any,
    @CurrentUser() user: any
  ) {
    try {
      this.logger.log(`Updating user ${id} by user: ${user.email}`);
      return await this.usersService.updateUser(id, updateData);
    } catch (error) {
      this.logger.error(`Failed to update user ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    try {
      this.logger.log(`Deleting user ${id} by user: ${user.email}`);
      await this.usersService.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete user ${id} by user: ${user.email}`, error.stack);
      throw error;
    }
  }
}
