import { ISerializable } from './Serializable';
import { SurveyOption } from './SurveyOption';

export class SurveyAnswer implements ISerializable {
  constructor(public surveyId: string, public option: SurveyOption) { }

  public toJSON() {
    return {
      option: this.option.toJSON(),
      surveyId: this.surveyId,
    };
  }

}
