import { forwardRef, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from 'src/schemas/client.schema';
import { AdminsModule } from '../admins/admins.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { NotesModule } from '../notes/notes.module';
import { MulterModule } from '@nestjs/platform-express';
import { ClientLogModule } from '../client-log/client-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    forwardRef(() => AdminsModule),
    SchedulesModule,
    NotesModule,
    ClientLogModule,
    MulterModule.register({ dest: './public/Client' }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
