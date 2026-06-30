import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskPriority } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
      };

      mockRepository.create.mockReturnValue({ ...createTaskDto, id: '1' });
      mockRepository.save.mockResolvedValue({ ...createTaskDto, id: '1' });

      const result = await service.create(createTaskDto);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe(createTaskDto.title);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const tasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ];
      mockRepository.findAndCount.mockResolvedValue([tasks, 2]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const task = { id: '1', title: 'Test Task' };
      mockRepository.findOne.mockResolvedValue(task);

      const result = await service.findOne('1');
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });
});