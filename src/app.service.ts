import { Injectable } from '@nestjs/common';
import ErrorService from './utils/errors';

@Injectable()
export class AppService {
  getErrorCodes() {
    return ErrorService.getErrorCodes();
  }
}
