import { SurveyOption } from './SurveyOption';

export class Answer {
  private _date: Date;

  constructor(private _surveyId: string, private _participantId: string, private _option: SurveyOption) {
    this._date = new Date();
  }

  get participantId() {
    return this._participantId;
  }

  get option() {
    return this._option;
  }

  get date() {
    return this._date;
  }

  get surveyId() {
    return this._surveyId;
  }
}
