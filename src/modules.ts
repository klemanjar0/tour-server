import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth.module';
import { EventModule } from './event/event.module';
import { UserManageModule } from './user/user-manage.module';
import { NotificationModule } from './notifications/notification.module';
import { SocketModule } from './socket';

export default [
  UserModule,
  AuthModule,
  EventModule,
  UserManageModule,
  NotificationModule,
  SocketModule,
];
