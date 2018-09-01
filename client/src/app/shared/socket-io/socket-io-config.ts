export class SocketIoConfig {
  constructor(
    public url: string,
    public options?: any) { }

    static SOCKET_IO_CONFIG_DEFAULT() {
      return new SocketIoConfig('http://localhost:8090/');
    }
}
