import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GetTaskFilterDTO } from './dto/filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status.pipes';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard()) //Restriction to Routes
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDTO,
    @GetUser() user:User,
  ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all Tasks`)
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  @HttpCode(405) 
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number,@GetUser() user:User): Promise<void> {
    return this.taskService.deleteTaskById(id,user);
  }

  @Post() //Another way
  createTask(
    @Body('title') title: string,
    @Body('description') description: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(title, description, user);
  }

  @Patch('/:id/status')

  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user:User
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, user);
  }
}
