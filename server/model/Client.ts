import { PublicClientInfo } from "./PublicClientInfo";

export class Client {
  getPublicInfo() {
    return new PublicClientInfo(this.participantId, <string>this.name);
  }
  constructor(private _socket: SocketIOClient.Socket, private _name?: string) {  }

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
