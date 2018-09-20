import { Message } from './message';
import { CreatedPublicSurveyInfo } from '../../../../../server/shared/CreatedPublicSurveyInfo';
import { SurveyOption } from '../../../../../server/shared/SurveyOption';
import { MessageControl } from '../../../../../server/shared/MessageControl';

export class SurveyInfoMessage implements Message {
  type = MessageControl.ServerMessages.SURVEY_INFO_EVENT;
  public surveyId: string;
  public title: string;
  public date: Date;
  public options: SurveyOption[];

  constructor(publicSurveyInfo?: CreatedPublicSurveyInfo) {
    if (publicSurveyInfo) {
      this.surveyId = publicSurveyInfo.surveyId;
      this.title = publicSurveyInfo.title;
      this.date = new Date(publicSurveyInfo.date);
      this.options = publicSurveyInfo.options.map(option => new SurveyOption(option.title));
    }
  }
}
