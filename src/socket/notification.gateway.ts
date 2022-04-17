import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import JwtService from '../shared/jwt.service';
import { socketActions } from './constants';

@WebSocketGateway(80, { cors: true })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    socket.emit(socketActions.socketChanges, {
      message: 'Socket connection established',
    });
    try {
      await this.authenticate(socket, socket.handshake.auth.authToken);
    } catch (e) {
      console.log(e);
    }
  }

  async emitNotification(userId: string | number, notification: any) {
    this.server
      .in(`user:${userId}`)
      .emit(socketActions.notification, notification);
  }

  async emitInvitation(userId: string | number, invite: any) {
    this.server.in(`user:${userId}`).emit(socketActions.invite, invite);
  }

  async authenticate(socket: Socket, authToken?: string) {
    if (authToken) {
      const clientData = await JwtService.decodeJwt(authToken);
      const userId = `user:${clientData.id}`;
      socket.join(userId);
      this.server.in(userId).emit(socketActions.socketChanges, {
        message: `Successfully logged with id: ${userId}, role: ${clientData.role}`,
      });
    }
  }

  @SubscribeMessage(socketActions.setId)
  async handleEvent(
    @MessageBody() { authToken }: { authToken: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      await this.authenticate(socket, authToken);
    } catch (e) {
      console.log(e);
    }
  }
}
