import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/pokemon',
})
export class PokemonGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('PokemonGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    // Notificar al cliente que se conectó exitosamente
    client.emit('connected', {
      message: 'Conectado al servidor de Pokémon',
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.logger.log(`Cliente ${client.id} se unió a la sala`);
    client.emit('joined', { message: 'Te has unido a la sala de Pokémon' });
  }

  // Método para emitir cuando se crea un nuevo Pokémon
  emitPokemonCreated(pokemon: any) {
    this.logger.log(`Emitiendo evento: pokemon-created`);
    this.server.emit('pokemon-created', pokemon);
  }

  // Método para emitir cuando se actualiza un Pokémon
  emitPokemonUpdated(pokemon: any) {
    this.logger.log(`Emitiendo evento: pokemon-updated`);
    this.server.emit('pokemon-updated', pokemon);
  }

  // Método para emitir cuando se elimina un Pokémon
  emitPokemonDeleted(id: number) {
    this.logger.log(`Emitiendo evento: pokemon-deleted`);
    this.server.emit('pokemon-deleted', { id });
  }

  // Método para emitir lista de todos los Pokémon
  emitPokemonList(pokemons: any[]) {
    this.logger.log(`Emitiendo lista de Pokémon`);
    this.server.emit('pokemon-list', pokemons);
  }
}

