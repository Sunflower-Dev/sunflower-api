import { Module } from '@nestjs/common';
import { OnlineOfficeService } from './online-office.service';
import { OnlineOfficeController } from './online-office.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OnlineOffice,
  OnlineOfficeSchema,
} from 'src/schemas/OnlineOffice.schema';
import { MulterModule } from '@nestjs/platform-express';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnlineOffice.name, schema: OnlineOfficeSchema },
    ]),
    MulterModule.register({ dest: './public/Course' }),
    AdminsModule,
  ],
  controllers: [OnlineOfficeController],
  providers: [OnlineOfficeService],
})
export class OnlineOfficeModule {}
