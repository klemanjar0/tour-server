import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import modules from './modules';
import { setUserIdToLocals } from './utils/middleware';

@Module({
  imports: modules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(setUserIdToLocals)
      .forRoutes({ path: 'upload-file', method: RequestMethod.POST });
  }
}
