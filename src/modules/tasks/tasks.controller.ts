import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { TaskResponseDto } from './dto/task-response.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.tasksService.create(createTaskDto);
    return new TaskResponseDto(task);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    const task = await this.tasksService.findOne(id);
    return new TaskResponseDto(task);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.tasksService.update(id, updateTaskDto);
    return new TaskResponseDto(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.tasksService.remove(id);
  }
}