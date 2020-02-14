import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { Quote } from 'src/entities/quote.entity';

@WebSocketGateway()
export class QuoteGateway {
  @WebSocketServer()
  server: Server;

  async emitQuote(quote: Quote) {
    this.server.emit('quote', {
      id: `${quote.id}`,
      price: `${quote.price}`,
      volume: `${quote.volume}`,
      marketCap: `${quote.marketCap}`,
      coin: quote.coin,
      createdAt: quote.createdAt,
    });
  }
}