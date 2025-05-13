import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TasksRepository) {}

  getTaskById(id: string, user: User): Promise<Task> {
    return this.taskRepository.findById(id, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    await this.taskRepository.deleteTask(id, user);
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    return await this.taskRepository.updateTaskStatus(
      id,
      updateTaskStatusDto,
      user,
    );
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }
}
