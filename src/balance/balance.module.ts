import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { setUserIdToLocals } from '../utils/middleware';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [],
  controllers: [BalanceController],
  providers: [BalanceService, UserService],
})
export class BalanceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(setUserIdToLocals, async (req, res, next) => {
        await new Promise((r) => setTimeout(r, 1000));
        next();
      })
      .forRoutes(BalanceController);
  }
}
