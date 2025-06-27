import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Module as CourseModule } from '../modules/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, CourseModule])],
  providers: [LessonsService],
  controllers: [LessonsController],
  exports: [LessonsService]
})
export class LessonsModule {}
