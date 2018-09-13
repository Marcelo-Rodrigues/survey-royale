import { ISerializable } from './Serializable';
import { SurveyOption } from './SurveyOption';

export class PublicSurveyInfo implements ISerializable {
  constructor(
    public title: string,
    public options: SurveyOption[],
    public isLocked: boolean) {
      this.options = options.map((option) => new SurveyOption(option.title));
    }

    public toJSON() {
      return {
        options: this.options.map((option) => option.toJSON()),
        title: this.title,
       };
    }
}
