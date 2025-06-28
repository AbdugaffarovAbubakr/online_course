import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { EntityNotFoundException, DuplicateEntityException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(name: string, email: string, password: string, role: UserRole = UserRole.STUDENT): Promise<User> {
    try {
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new DuplicateEntityException('User', 'email', email);
      }

      const user = this.usersRepository.create({ name, email, password, role });
      const savedUser = await this.usersRepository.save(user);
      
      this.logger.log(`User created: ${email} with role ${role}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${email}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error.stack);
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new EntityNotFoundException('User', id);
      }
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user by id: ${id}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      this.logger.error('Failed to find all users', error.stack);
      throw error;
    }
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    try {
      const user = await this.findById(id);
      Object.assign(user, updateData);
      const updatedUser = await this.usersRepository.save(user);
      
      this.logger.log(`User updated: ${id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user: ${id}`, error.stack);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.findById(id);
      await this.usersRepository.remove(user);
      
      this.logger.log(`User deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete user: ${id}`, error.stack);
      throw error;
    }
  }
}
