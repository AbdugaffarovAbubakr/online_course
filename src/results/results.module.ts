import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './result.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Course } from '../courses/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Assignment, Course])],
  providers: [ResultsService],
  controllers: [ResultsController],
  exports: [ResultsService]
})
export class ResultsModule {}
