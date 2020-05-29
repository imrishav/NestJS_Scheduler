import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { GetTaskFilterDTO } from './dto/filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTaskFilterDTO) {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find(task => task.id === id);
    if (!found) {
      throw new NotFoundException('Task with id Not Found!');
    }

    return found;
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== found.id);
  }

  createTask(title: string, description: string): Task {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
