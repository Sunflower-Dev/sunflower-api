import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/schemas/Chat.schema';
import { AdminsService } from '../admins/admins.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private adminsService: AdminsService,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  async create(dto: CreateChatDto) {
    return new this.chatModel({ ...dto }).save();
  }

  async findAll(RequesterID: string) {
    const Admins = await this.adminsService.GetAdminsCustom({
      _id: { $ne: RequesterID },
    });

    const LastChats = await this.chatModel
      .find(
        {
          $and: [
            { $or: [{ To: RequesterID }, { From: RequesterID }] },
            { MessageType: 'TEXT' },
            { DeletedBy: { $ne: RequesterID } },
          ],
        },
        {},
        { sort: { CreatedAt: -1 } },
      )
      .exec();
    // console.log(LastChats);

    var Chats = [];
    Admins.forEach((element) => {
      if (!Chats.find((x) => x.AdminID === element._id)) {
        const Count = LastChats.filter(
          (item) =>
            item.From === element._id.toString() && item.Status === 'SENT',
        ).length;

        Chats.push({
          AdminID: element._id,
          chat: LastChats.find(
            (ct) =>
              ct.To === element._id.toString() ||
              ct.From === element._id.toString(),
          ),
          Count,
        });
      }
    });

    return { Admins, Chats };
  }

  async getChatByID(hostchat: string, peerchat: string) {
    const EditChat = await this.chatModel.updateMany(
      {
        $and: [{ To: hostchat }, { From: peerchat }, { Status: 'SENT' }],
      },
      { $set: { Status: 'SEEN' } },
    );

    const Chat = await this.chatModel
      .find({
        $and: [
          {
            $or: [
              { $and: [{ From: hostchat }, { To: peerchat }] },
              { $and: [{ From: peerchat }, { To: hostchat }] },
            ],
          },
          { DeletedBy: { $ne: hostchat } },
        ],
      })
      .exec();
    const Admin = await this.adminsService.GetAdminsCustom(
      { _id: peerchat },
      '_id Avatar Name',
    );

    return { Chat, Admin: Admin[0] };
  }

  async ClearHistory(peerchat: string, RequesterId: string) {
    const Update = await this.chatModel
      .updateMany(
        {
          $or: [
            { $and: [{ From: RequesterId }, { To: peerchat }] },
            { $and: [{ From: peerchat }, { To: RequesterId }] },
          ],
        },
        { $push: { DeletedBy: RequesterId } },
      )
      .exec();

    return Update;
  }
}
