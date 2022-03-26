import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('error-codes')
  getErrorCodes(): Record<number, string> {
    return this.appService.getErrorCodes();
  }

  @Get('image/:id')
  async getImage(@Param() id: number): Promise<ArrayBuffer | null> {
    return (await this.appService.getFile(id)).data || null;
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
