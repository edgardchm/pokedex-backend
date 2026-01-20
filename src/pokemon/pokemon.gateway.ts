// Importaciones de NestJS para WebSockets
import {
  WebSocketGateway,      // Decorador para crear un gateway de WebSocket
  WebSocketServer,       // Decorador para inyectar el servidor de Socket.IO
  SubscribeMessage,      // Decorador para suscribirse a mensajes del cliente
  OnGatewayConnection,   // Interfaz para manejar conexiones
  OnGatewayDisconnect,   // Interfaz para manejar desconexiones
  MessageBody,           // Decorador para extraer el cuerpo del mensaje
  ConnectedSocket,       // Decorador para obtener el socket del cliente
} from '@nestjs/websockets';
// Importaciones de Socket.IO para comunicación en tiempo real
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * Gateway de WebSocket para comunicación en tiempo real sobre Pokémon
 * Permite a los clientes recibir actualizaciones instantáneas cuando se crean,
 * actualizan o eliminan Pokémon
 */
@WebSocketGateway({
  cors: {
    origin: '*',         // Permite conexiones desde cualquier origen (en producción usar dominios específicos)
    credentials: true,   // Permite enviar cookies y headers de autenticación
  },
  namespace: '/pokemon', // Todas las conexiones estarán bajo /pokemon
})
export class PokemonGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // Servidor de Socket.IO inyectado automáticamente por NestJS
  @WebSocketServer()
  server: Server;

  // Logger para registrar eventos y depuración
  private logger: Logger = new Logger('PokemonGateway');

  /**
   * Se ejecuta cuando un cliente se conecta al servidor WebSocket
   * @param client - Socket del cliente que se conectó
   */
  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    // Notificar al cliente que se conectó exitosamente
    // client.emit() envía un mensaje solo a este cliente específico
    client.emit('connected', {
      message: 'Conectado al servidor de Pokémon',
      clientId: client.id,
    });
  }

  /**
   * Se ejecuta cuando un cliente se desconecta del servidor WebSocket
   * @param client - Socket del cliente que se desconectó
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  /**
   * Maneja el mensaje 'join-room' enviado por el cliente
   * Permite que los clientes se unan a salas específicas para recibir actualizaciones
   * @param client - Socket del cliente que envió el mensaje
   * @param data - Datos opcionales enviados con el mensaje
   */
  @SubscribeMessage('join-room')  // Escucha mensajes con el evento 'join-room'
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.logger.log(`Cliente ${client.id} se unió a la sala`);
    // Responde solo al cliente que envió el mensaje
    client.emit('joined', { message: 'Te has unido a la sala de Pokémon' });
  }

  /**
   * Emite un evento a todos los clientes conectados cuando se crea un nuevo Pokémon
   * @param pokemon - El Pokémon recién creado
   */
  emitPokemonCreated(pokemon: any) {
    this.logger.log(`Emitiendo evento: pokemon-created`);
    // server.emit() envía el mensaje a TODOS los clientes conectados
    this.server.emit('pokemon-created', pokemon);
  }

  /**
   * Emite un evento a todos los clientes conectados cuando se actualiza un Pokémon
   * @param pokemon - El Pokémon actualizado
   */
  emitPokemonUpdated(pokemon: any) {
    this.logger.log(`Emitiendo evento: pokemon-updated`);
    this.server.emit('pokemon-updated', pokemon);
  }

  /**
   * Emite un evento a todos los clientes conectados cuando se elimina un Pokémon
   * @param id - ID del Pokémon eliminado
   */
  emitPokemonDeleted(id: number) {
    this.logger.log(`Emitiendo evento: pokemon-deleted`);
    // Solo enviamos el ID porque el Pokémon ya no existe en la BD
    this.server.emit('pokemon-deleted', { id });
  }

  /**
   * Emite la lista completa de Pokémon a todos los clientes conectados
   * Útil para sincronizar el estado inicial o después de cambios masivos
   * @param pokemons - Array con todos los Pokémon
   */
  emitPokemonList(pokemons: any[]) {
    this.logger.log(`Emitiendo lista de Pokémon`);
    this.server.emit('pokemon-list', pokemons);
  }
}

