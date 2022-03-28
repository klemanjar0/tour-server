import { Injectable } from '@nestjs/common';
import Notification from './notification.model';

@Injectable()
export class NotificationService {
  async createNotification(notify: Notification) {
    return await Notification.create(notify);
  }
  async deleteNotification(id: number) {
    return await Notification.destroy({
      where: {
        id: id,
      },
    });
  }
  async getUserNotifications(userId: number) {
    return await Notification.findAll({ where: { userId: userId } });
  }
  async deleteAllUserNotifications(userId: number) {
    return await Notification.destroy({ where: { userId: userId } });
  }
  async readNotification(id: number) {
    return await Notification.update(
      { seen: true },
      {
        where: { id: id },
      },
    );
  }
  async readAllUserNotifications(userId: number) {
    return await Notification.update(
      { seen: true },
      { where: { userId: userId } },
    );
  }
}
