import { Serializable } from "./Serializable";

export class SurveyOption implements Serializable {
  constructor(private _title: string) { }

  get title() {
    return this._title;
  }
  
  serialize() {
    return {
      title: this.title
    };
  }
}
