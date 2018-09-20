import { ISerializable } from './Serializable';

export class SurveyOption implements ISerializable {
  constructor(private _title: string) { }

  get title() {
    return this._title;
  }

  public toJSON() {
    return {
      title: this.title,
    };
  }
}
