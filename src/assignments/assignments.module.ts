import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';
import { Module as CourseModule } from '../modules/module.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, CourseModule, User])],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
  exports: [AssignmentsService]
})
export class AssignmentsModule {}
