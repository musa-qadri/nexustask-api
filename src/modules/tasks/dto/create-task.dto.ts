import { IsString, IsOptional, IsEnum, IsDateString, MinLength, MaxLength } from 'class-validator';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(1, { message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  dueDate?: string;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be LOW, MEDIUM, or HIGH' })
  priority?: TaskPriority = TaskPriority.MEDIUM;
}