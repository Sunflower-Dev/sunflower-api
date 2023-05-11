import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Task, TaskDocument } from 'src/schemas/Task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, Assigner: string) {
    const { ExpireDate, ...data } = createTaskDto;
    const newtask = new this.taskModel({
      ...data,
      Status: 'IDLE',
      ExpireDate: new Date(ExpireDate),
      CreatedAt: new Date(),
      Assigner,
    });
    return await newtask.save();
  }

  async getList(TaskFilterQuery: FilterQuery<Task>) {
    return this.taskModel.find(TaskFilterQuery);
  }

  async ChangeStatus(TaskId: string, Status: string) {
    return this.taskModel.updateOne(
      { _id: TaskId },
      { $set: { Status: Status } },
    );
  }
}
