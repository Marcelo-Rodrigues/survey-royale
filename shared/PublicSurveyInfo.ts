import { SurveyOption } from './SurveyOption';
import { Serializable } from './Serializable';

export class PublicSurveyInfo implements Serializable {
  constructor(
    public title: string,
    public options: SurveyOption[],
    public isLocked: boolean) {
      this.options = options.map(option => new SurveyOption(option.title));
    }

    public toJSON() {
      return {
          title: this.title,
          options: this.options.map(option=>option.toJSON())
       }
    }
}
