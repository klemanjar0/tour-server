import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('error-codes')
  getErrorCodes(): Record<number, string> {
    return this.appService.getErrorCodes();
  }
}
