import { Injectable, NotFoundException } from '@nestjs/common';

import { randomBytes } from 'crypto';
import { GetTaskFilterDTO } from './dto/filter.dto';
import { TaskRepo } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepo)
    private taskRepository: TaskRepo,
  ) {}

  getTasks(filterDto: GetTaskFilterDTO, user:User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user:User): Promise<Task> {
    const found = await this.taskRepository.findOne({where: {id,userId: user.id}});
    console.log(found)

    if (!found) {
      throw new NotFoundException('Task with id Not Found!');
    }
    return found;
  }

  // async getAllTasks(): Promise<Task> {
  //   return await this.taskRepository.find()
  // }

  createTask(title: string, description: string, user: User): Promise<Task> {
    return this.taskRepository.createTask(title, description, user);
  }

  async deleteTaskById(id: number, user:User): Promise<void> {
    const result = await this.taskRepository.delete({id, userId:user.id});

    if (!result.affected) {
      throw new NotFoundException('Task with id Not Found!');
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user:User): Promise<Task> {
    const task = await this.getTaskById(id,user);
    task.status = status;
    await task.save();
    return task;
  }

  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilter(filterDto: GetTaskFilterDTO) {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       task =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }
  // getTaskById(id: string): Task {
  //   const found = this.tasks.find(task => task.id === id);
  // if (!found) {
  //   throw new NotFoundException('Task with id Not Found!');
  // }
  // return found;
  // }
  // deleteTaskById(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter(task => task.id !== found.id);
  // }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
