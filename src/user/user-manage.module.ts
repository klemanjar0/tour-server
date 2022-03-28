import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserService } from './user.service';
import { setUserIdToLocals } from '../utils/middleware';
import { UserManageController } from './user-manage.controller';

@Module({
  imports: [],
  controllers: [UserManageController],
  providers: [UserService],
})
export class UserManageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setUserIdToLocals).forRoutes(UserManageController);
  }
}
