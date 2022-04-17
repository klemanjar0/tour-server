import { SocketGateway } from './notification.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [SocketGateway],
})
export class SocketModule {}
