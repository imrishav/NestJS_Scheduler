import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDTO } from './dto/filter.dto';

@EntityRepository(Task)
export class TaskRepo extends Repository<Task> {
  async getTasks(filterDto: GetTaskFilterDTO): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status=:status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description :search', {
        search: `%${search}%`,
      });
    }

    const task = await query.getMany();
    return task;
  }

  async createTask(title: string, description: string): Promise<Task> {
    const task = new Task();

    (task.title = title),
      (task.description = description),
      (task.status = TaskStatus.OPEN);

    await task.save();
    return task;
  }
}
