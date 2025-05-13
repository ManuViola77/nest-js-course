import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task) private readonly repository: Repository<Task>,
  ) {}

  async findById(id: string, user: User): Promise<Task> {
    const task = await this.repository.findOneBy({ id, user });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.repository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.repository.save(task);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.repository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const task: Task = await this.findById(id, user);
    task.status = updateTaskStatusDto.status;
    await this.repository.save(task);
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.repository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
