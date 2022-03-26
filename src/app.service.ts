import { Injectable } from '@nestjs/common';
import ErrorService from './utils/errors';
import File from './database/file.model';

@Injectable()
export class AppService {
  getErrorCodes() {
    return ErrorService.getErrorCodes();
  }

  async uploadFile(
    filename: string,
    mimetype: string,
    file: ArrayBuffer,
  ): Promise<number> {
    const uploaded = await File.create({
      filename,
      mimetype,
      data: file,
    });
    return uploaded.id;
  }

  async getFile(id: number) {
    return await File.findByPk(id);
  }
}
