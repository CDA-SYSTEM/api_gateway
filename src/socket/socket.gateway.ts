import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { io as ClientIo, Socket as ClientSocket } from 'socket.io-client';

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'] },
  namespace: '/events',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);
  private formServiceSocket: ClientSocket | null = null;

  constructor(private readonly configService: ConfigService) {}

  afterInit(): void {
    const formServiceUrl = this.configService.get<string>('RECEPTION_SERVICE_BASE_URL') || '';
    if (!formServiceUrl) {
      this.logger.warn('RECEPTION_SERVICE_BASE_URL not defined, skipping form-service socket connection');
      return;
    }

    const apiKey = this.configService.get<string>('API_KEY') || '';
    this.logger.log(`Connecting to form-service Socket.IO at ${formServiceUrl}/events`);
    this.formServiceSocket = ClientIo(`${formServiceUrl}/events`, {
      transports: ['websocket', 'polling'],
      auth: { 'x-api-key': apiKey },
    });

    this.formServiceSocket.on('connect', () => {
      this.logger.log(`Connected to form-service socket: ${this.formServiceSocket?.id}`);
    });

    this.formServiceSocket.on('disconnect', (reason: string) => {
      this.logger.log(`Disconnected from form-service socket: ${reason}`);
    });

    this.formServiceSocket.on('connect_error', (err: Error) => {
      this.logger.error(`Form-service socket connection error: ${err.message}`);
    });

    this.formServiceSocket.on('invoice.created', (payload: unknown) => {
      this.logger.log('Relaying invoice.created event to frontend clients');
      this.server.emit('invoice.created', payload);
    });

    this.formServiceSocket.on('inspection.status.updated', (payload: unknown) => {
      this.logger.log('Relaying inspection.status.updated event to frontend clients');
      this.server.emit('inspection.status.updated', payload);
    });
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Frontend client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Frontend client disconnected: ${client.id}`);
  }
}
