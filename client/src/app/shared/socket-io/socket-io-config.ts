import { environment } from '../../../environments/environment';

export class SocketIoConfig {
  constructor(
    public url: string,
    public options?: any) { }
}

export const SOCKET_IO_CONFIG_DEFAULT = new SocketIoConfig(environment.apiBase);
