import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/Notification.schema';
import { ChatGateway } from '../chat/chat.gateway';
import { CreateNotificationDto } from './dto/CreateNotification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notifModel: Model<NotificationDocument>,
    private readonly socketService: ChatGateway,
  ) {}

  async Create(dto: CreateNotificationDto) {
    const CreateNotif = new this.notifModel({
      ...dto,
      CreatedAt: new Date(),
      DeletedBy: [],
      SeenBy: [],
    });

    this.socketService.NewNotification(dto);

    return CreateNotif.save();
  }

  async GetList(id: string) {
    const List = await this.notifModel.find({ DeletedBy: { $nin: id } });

    var Notifs = [],
      Seen = [];

    List.forEach((item) => {
      if (item.SeenBy.includes(id as any)) {
        Seen.push(item);
      } else {
        Notifs.push(item);
      }
    });

    return { Notifs, Seen };
  }

  async FindOne(id: string, Viewer: string) {
    const Notif = await this.notifModel.findOne({ _id: id });

    if (!Notif.SeenBy.includes(Viewer as any)) {
      const Update = await this.notifModel.updateOne(
        { _id: id },
        { $push: { SeenBy: Viewer } },
      );
    }
    return Notif;
  }

  async DeleteNotifForAdmin(id: string, Admin: any) {
    const Update = await this.notifModel.updateOne(
      { _id: id },
      { $push: { DeletedBy: Admin } },
    );
    return Update;
  }
}
