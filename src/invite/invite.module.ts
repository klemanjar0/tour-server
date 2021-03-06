import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { setUserIdToLocals } from '../utils/middleware';
import { UserService } from '../user/user.service';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { SocketGateway } from '../socket/notification.gateway';
import { EventService } from '../event/event.service';

@Module({
  imports: [],
  controllers: [InviteController],
  providers: [InviteService, UserService, SocketGateway, EventService],
})
export class InviteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setUserIdToLocals).forRoutes(InviteController);
  }
}
