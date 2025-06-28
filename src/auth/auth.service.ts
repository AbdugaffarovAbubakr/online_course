import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/user.entity';
import { DuplicateEntityException, InvalidOperationException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string, role: string = 'student'): Promise<User> {
    try {
      if (!Object.values(UserRole).includes(role as UserRole)) {
        throw new InvalidOperationException('register', 'Invalid role specified');
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await this.usersService.createUser(name, email, hash, role as UserRole);
      
      this.logger.log(`User registered successfully: ${email} with role ${role}`);
      return user;
    } catch (error) {
      if (error instanceof DuplicateEntityException) {
        throw error;
      }
      this.logger.error(`Registration failed for: ${email}`, error.stack);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`User validated successfully: ${email}`);
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`User validation failed for: ${email}`, error.stack);
      throw error;
    }
  }

  async login(user: User) {
    try {
      const payload = { 
        sub: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      };
      
      const accessToken = this.jwtService.sign(payload, { 
        secret: process.env.JWT_SECRET, 
        expiresIn: process.env.JWT_EXPIRES_IN || '15m' 
      });
      
      const refreshToken = this.jwtService.sign(payload, { 
        secret: process.env.JWT_REFRESH_SECRET, 
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' 
      });

      this.logger.log(`User logged in successfully: ${user.email}`);
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Login failed for user: ${user.email}`, error.stack);
      throw error;
    }
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.usersService.findById(payload.sub);
      
      this.logger.log(`Token refreshed for user: ${user.email}`);
      return this.login(user);
    } catch (error) {
      this.logger.error('Token refresh failed', error.stack);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number): Promise<void> {
    try {
      this.logger.log(`User logged out: ${userId}`);
    } catch (error) {
      this.logger.error(`Logout failed for user: ${userId}`, error.stack);
      throw error;
    }
  }
}
