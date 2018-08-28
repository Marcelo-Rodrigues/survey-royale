import { Serializable } from "./Serializable";

export class PublicClientInfo implements Serializable {
  constructor(public id: string, public name: string) { }

  public serialize() {
    return {
        id: this.id,
        name: this.name
     };
  }
}

