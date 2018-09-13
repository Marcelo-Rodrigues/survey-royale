import { ISerializable } from './Serializable';

export class PublicClientInfo implements ISerializable {
  constructor(public id: string, public name: string) { }

  public toJSON() {
    return {
        id: this.id,
        name: this.name,
     };
  }
}
