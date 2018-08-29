import { SurveyOption } from './SurveyOption';
import { Serializable } from './Serializable'

export class PublicAnswerInfo implements Serializable {
  public date: Date;

  constructor(public surveyId: string, public participantId: string, public option: SurveyOption) {
    this.date = new Date();
  }

  serialize() {
    return {
      participantId: this.participantId,
      option: this.option,
      date: this.date,
      surveyId: this.surveyId
    };
  }
}
