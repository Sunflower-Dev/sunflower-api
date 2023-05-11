import { CACHE_MANAGER, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { CreateNotificationDto } from '../notifications/dto/CreateNotification.dto';

@WebSocketGateway()
export class ChatGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server;

  handleConnection(@MessageBody() data: any) {}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: any) {
    const Chat = await this.chatService.create({
      CreatedAt: new Date(),
      From: data.From,
      Message: data.message,
      MessageType: data.Type,
      Status: 'SENT',
      To: data.To,
    });
    this.server.emit(data.To, Chat);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const cache =
      ((await this.cacheManager.get('Users')) as [
        {
          socketID: string;
          userID: string;
        },
      ]) || null;

    if (cache === null) {
      var Users = [{ socketID: client.id, userID: data }];
      await this.cacheManager.set('Users', Users, { ttl: 360 * 24 * 60 * 60 });
      this.server.emit('OnlineStatus', Users);
    } else {
      var newUsers = [...cache, { socketID: client.id, userID: data }];
      await this.cacheManager.set('Users', newUsers, {
        ttl: 360 * 24 * 60 * 60,
      });
      this.server.emit('OnlineStatus', newUsers);
    }
  }

  async handleDisconnect(@MessageBody() data: any) {
    // console.log(data.id + ' Disconnected!');
    const cache = (await this.cacheManager.get('Users')) as [
      {
        socketID: string;
        userID: string;
      },
    ];
    if (cache && cache.find((item) => item.socketID !== data.id)) {
      var newUsers = cache.filter((item) => item.socketID !== data.id);
      await this.cacheManager.set('Users', newUsers, {
        ttl: 360 * 24 * 60 * 60,
      });

      this.server.emit('OnlineStatus', newUsers);
    }
  }

  async NewNotification(dto: CreateNotificationDto) {
    this.server.emit('NewNotification', dto);
  }
}
