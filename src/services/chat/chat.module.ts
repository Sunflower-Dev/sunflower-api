import { CacheModule, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from '../admins/admins.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/schemas/Chat.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    CacheModule.register(),
    JwtModule.register({
      secret: '#MU[vTqF4};}g[,yQdf,8}ZB^g@8(G.]EaY`CmB"',
      signOptions: { expiresIn: '30 days' },
    }),
    AdminsModule,
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MulterModule.register({ dest: './public/Chat' }),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
