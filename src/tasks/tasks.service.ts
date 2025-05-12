import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TasksRepository) {}

  getTaskById(id: string): Promise<Task> {
    return this.taskRepository.findById(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.deleteTask(id);
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return await this.taskRepository.updateTaskStatus(id, updateTaskStatusDto);
  }

  /*   getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    return this.tasks.filter(
      (task) =>
        (!filterDto.status || task.status === filterDto.status) &&
        (!filterDto.search ||
          task.title.toLowerCase().includes(filterDto.search.toLowerCase()) ||
          task.description
            .toLowerCase()
            .includes(filterDto.search.toLowerCase())),
    );
  }

   */
}
