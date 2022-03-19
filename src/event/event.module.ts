import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { setUserIdToLocals } from '../utils/middleware';
import { UserService } from '../user/user.service';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [EventService, UserService],
})
export class EventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setUserIdToLocals).forRoutes(EventController);
  }
}
