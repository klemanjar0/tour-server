import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { setUserIdToLocals } from '../utils/middleware';
import { UserService } from '../user/user.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService, UserService],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setUserIdToLocals).forRoutes(NotificationController);
  }
}
