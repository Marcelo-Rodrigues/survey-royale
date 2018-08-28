import { SurveyOption } from './SurveyOption';

export class PublicSurveyInfo {
  constructor(
    public date: Date,
    public surveyId: string,
    public title: string,
    public options: SurveyOption[] ,
    public adminPwd?: string) { }
}
