import { Injectable, Inject } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketIoConfig } from './socket-io-config';

export const SOCKET_CONFIG_TOKEN = '_socket_config_token_';

@Injectable()
export class SocketIoService {

  private _ioSocket: SocketIOClient.Socket = null;

  constructor(@Inject(SOCKET_CONFIG_TOKEN) private config: SocketIoConfig) { }

  public get socket() {
    if (!this._ioSocket) {
      const url: string = this.config.url || '';
      const options: any = this.config.options || {};
      this._ioSocket = io(url, options);
    }

    return this._ioSocket;
  }

  public get url() {
    return this.config.url;
  }

}
