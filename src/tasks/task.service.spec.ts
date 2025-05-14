import { Test } from '@nestjs/testing';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  createTask: jest.fn(),
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  findById: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  id: 'myid',
  username: 'testuser',
  password: 'testpassword',
  tasks: [],
};

const mockTasks = [
  {
    id: '11111',
    title: 'Test task 1',
    description: 'Test desc 1',
    status: TaskStatus.OPEN,
    user: mockUser,
  },
  {
    id: '22222',
    title: 'Test task 2',
    description: 'Test desc 2',
    status: TaskStatus.IN_PROGRESS,
    user: mockUser,
  },
  {
    id: '33333',
    title: 'Test task 3',
    description: 'Test desc 3',
    status: TaskStatus.OPEN,
    user: mockUser,
  },
];

const mockFilterDto = { status: TaskStatus.OPEN, search: 'Test' };

describe('TaskService', () => {
  let taskService: TasksService;
  let taskRepository: TasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    taskService = module.get(TasksService);
    taskRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      taskRepository.getTasks = jest.fn().mockResolvedValue(mockTasks);
      const result = await taskService.getTasks(null, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalledWith(null, mockUser);
      expect(result).toEqual(mockTasks);
    });

    it('calls TasksRepository.getTasks with filters and returns the result', async () => {
      taskRepository.getTasks = jest.fn().mockResolvedValue(mockTasks);
      const result = await taskService.getTasks(mockFilterDto, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalledWith(
        mockFilterDto,
        mockUser,
      );
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findById and returns the result', async () => {
      const mockTask = {
        id: '11111',
        title: 'Test task 1',
        description: 'Test desc 1',
        status: TaskStatus.OPEN,
        user: mockUser,
      };

      taskRepository.findById = jest.fn().mockResolvedValue(mockTask);
      const result = await taskService.getTaskById('11111', mockUser);
      expect(taskRepository.findById).toHaveBeenCalledWith('11111', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('throws an error if task not found', async () => {
      taskRepository.findById = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException(`Task with ID 11111 not found.`),
        );
      await expect(taskService.getTaskById('11111', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
