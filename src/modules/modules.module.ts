import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as CourseModule } from './module.entity';
import { Course } from '../courses/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseModule, Course])],
  providers: [ModulesService],
  controllers: [ModulesController],
  exports: [ModulesService]
})
export class ModulesModule {}
