import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Res,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { getLocalUser } from '../event/event.utils';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('my')
  async getAllUserNotifications(@Res() res: Response) {
    const userId = getLocalUser(res).id;
    const notifications = await this.notificationService.getUserNotifications(
      userId,
    );
    return res.status(HttpStatus.OK).json(notifications);
  }

  @Put('read')
  async readNotification(@Res() res: Response, @Body() body: { id: number }) {
    const notification = await this.notificationService.readNotification(
      body.id,
    );
    return res.status(HttpStatus.OK).json(notification);
  }

  @Put('readAll')
  async readAllNotifications(@Res() res: Response) {
    const userId = getLocalUser(res).id;
    const notifications =
      await this.notificationService.readAllUserNotifications(userId);
    return res.status(HttpStatus.OK).json(notifications);
  }

  @Delete('delete')
  async deleteNotification(@Res() res: Response, @Body() body: { id: number }) {
    const affectedRows = await this.notificationService.deleteNotification(
      body.id,
    );
    return res.status(HttpStatus.OK).json(affectedRows);
  }

  @Delete('deleteAll')
  async deleteAllNotifications(@Res() res: Response) {
    const userId = getLocalUser(res).id;
    const affectedRows =
      await this.notificationService.deleteAllUserNotifications(userId);
    return res.status(HttpStatus.OK).json(affectedRows);
  }
}
