import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth.module';
import { EventModule } from './event/event.module';
import { UserManageModule } from './user/user-manage.module';
import { NotificationModule } from './notifications/notification.module';
import { SocketModule } from './socket';
import { InviteModule } from './invite/invite.module';
import { BalanceModule } from './balance/balance.module';

export default [
  UserModule,
  AuthModule,
  EventModule,
  UserManageModule,
  NotificationModule,
  SocketModule,
  InviteModule,
  BalanceModule,
];
