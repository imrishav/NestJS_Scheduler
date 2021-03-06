import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDTO } from './dto/filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepo extends Repository<Task> {
  async getTasks(filterDto: GetTaskFilterDTO, user:User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', {userId: user.id})

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

  async createTask(
    title: string,
    description: string,
    user: User,
  ): Promise<Task> {
    const task = new Task();

    (task.title = title),
      (task.description = description),
      (task.status = TaskStatus.OPEN), 
      // (task.user = user));
      task.user = user

    await task.save();
    delete task.user;
    return task;
  }
}
