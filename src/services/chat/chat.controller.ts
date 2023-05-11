import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.chatService.findAll(req.user.sub);
  }

  @Get('/:id')
  getChatByID(@Param('id') peerchat: string, @Request() req: any) {
    const hostchat = req.user.sub;
    return this.chatService.getChatByID(hostchat, peerchat);
  }

  @Post('/Upload')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/Chat',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  AttachFile(@UploadedFile() File: Express.Multer.File) {
    return {
      URL: '/Uploads/Chat/' + File.filename,
      Type: extname(File.filename).replace(/[.]/g, '').toUpperCase(),
    };
  }

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Delete(':PeerChat')
  async ClearHistory(@Param('PeerChat') PeerChat: string, @Request() req: any) {
    return this.chatService.ClearHistory(PeerChat, req.user.sub);
  }
}
