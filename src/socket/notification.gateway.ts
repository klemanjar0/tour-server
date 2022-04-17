import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const socketsById = { 0: [] };
const idBySocket = {};

@WebSocketGateway(80, { cors: true })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    console.log(socket.id);
    socket.emit('SOCKET_CHANGES', { hello: 'world' });
  }

  @SubscribeMessage('SET_ID_SOCKET')
  async handleEvent(
    @MessageBody() { id, authToken }: { id: number; authToken: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket.id);
    console.log('------');
    console.log(socket.handshake.auth);
    console.log('------');
    socket.emit('SOCKET_CHANGES', {
      message: `Successfully logged with id: ${id}`,
      token: authToken,
    });
  }
}
