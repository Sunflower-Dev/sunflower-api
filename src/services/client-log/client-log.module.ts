import { forwardRef, Module } from '@nestjs/common';
import { ClientLogService } from './client-log.service';
import { ClientLogController } from './client-log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientLog, ClientLogSchema } from 'src/schemas/ClientLog.schema';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientLog.name, schema: ClientLogSchema },
    ]),
    forwardRef(() => AdminsModule),
  ],
  controllers: [ClientLogController],
  providers: [ClientLogService],
  exports: [ClientLogService],
})
export class ClientLogModule {}
