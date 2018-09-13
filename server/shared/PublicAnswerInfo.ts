import { ISerializable } from './Serializable';
import { SurveyOption } from './SurveyOption';

export class PublicAnswerInfo implements ISerializable {
  public date: Date;

  constructor(public surveyId: string, public participantId: string, public option: SurveyOption) {
    this.date = new Date();
  }

  public toJSON() {
    return {
      date: this.date,
      option: this.option,
      participantId: this.participantId,
      surveyId: this.surveyId,
    };
  }
}
