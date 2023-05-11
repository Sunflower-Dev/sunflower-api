import { forwardRef, Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminSchema, Admin } from '../../schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '../clients/clients.module';
import { TasksModule } from '../tasks/tasks.module';
import { ClientLogModule } from '../client-log/client-log.module';
@Module({
  imports: [
    JwtModule.register({
      secret: '#MU[vTqF4};}g[,yQdf,8}ZB^g@8(G.]EaY`CmB"',
      signOptions: { expiresIn: '30 days' },
    }),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => ClientsModule),
    TasksModule,
    ClientLogModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
