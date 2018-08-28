import { SurveyOption } from './SurveyOption';
import { Serializable } from './Serializable';

export class PublicSurveyInfo implements Serializable {
  public options: SurveyOption[];

  constructor(
    public title: string,
    options: SurveyOption[]) { 
      this.options = options.map(option => new SurveyOption(option.title));
    }

    public serialize() {
      return {
          title: this.title,
          options: this.options.map(option=>option.serialize())
       }
    }
}
