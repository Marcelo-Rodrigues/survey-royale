import { SurveyOption } from '../../model/survey-option';
import { Message } from './message';

export class SurveyInfoMessage implements Message {
  type = 'surveyInfoMessage';
  public surveyId: string;
  public title: string;
  public date: Date;
  public options: SurveyOption[];

  constructor(data?) {
    if (data) {
      this.surveyId = data.surveyId;
      this.title = data.title;
      this.date = new Date(data.date);
      this.options = data.options.map(option => new SurveyOption(option.title));
    }
  }
}
