export class Client {
  constructor(socket,  name){
    this.socket = socket;
    this.name = name;
  }

  emit() {
    this.socket.emit(event, data);
  }

  get participantId() {
    return this.socket.id;
  }

  get name() {
    return this.name;
  }
}
