import { TaskPriority } from '../entities/task.entity';

export class TaskResponseDto {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TaskResponseDto>) {
    Object.assign(this, partial);
  }
}