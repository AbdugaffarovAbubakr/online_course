import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, User]), 
    AuthModule
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService]
})
export class CoursesModule {}
