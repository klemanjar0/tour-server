import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('error-codes')
  getErrorCodes(): Record<number, string> {
    return this.appService.getErrorCodes();
  }

  @Get('file/:id')
  async getImage(@Param() { id }: { id: number }, @Res() res: Response) {
    const file = await this.appService.getFile(id);
    return res.status(HttpStatus.OK).send(file.data);
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const uploadedId = await this.appService.uploadFile(
      file.originalname,
      file.mimetype,
      file.buffer,
    );
    return res.status(HttpStatus.OK).json({ fileId: uploadedId });
  }
}
