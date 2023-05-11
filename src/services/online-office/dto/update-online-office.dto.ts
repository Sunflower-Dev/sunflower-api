import { PartialType } from '@nestjs/swagger';
import { CreateOnlineOfficeDto } from './create-online-office.dto';

export class UpdateOnlineOfficeDto extends PartialType(CreateOnlineOfficeDto) {}
