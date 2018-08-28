import { PublicClientInfo } from '../shared/PublicClientInfo';

export class Client {
  constructor(private _socket: SocketIO.Socket, private _name?: string) {  }

  getPublicInfo() {
    return new PublicClientInfo(this.participantId, <string>this.name);
  }
  
  emit(event: string, ...args: any[]) {
    this._socket.emit(event, args);
  }

  get participantId() {
    return this._socket.id;
  }

  get name() {
    return this._name;
  }
}
