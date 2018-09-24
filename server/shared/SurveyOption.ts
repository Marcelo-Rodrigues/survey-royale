import { ISerializable } from './Serializable';

export class SurveyOption implements ISerializable {
  constructor(public title: string) { }

  public toJSON() {
    return {
      title: this.title,
    };
  }
}
