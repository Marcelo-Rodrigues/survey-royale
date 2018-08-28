import { SurveyOption } from './SurveyOption';
import { Serializable } from './Serializable'

export class Answer implements Serializable {
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

  serialize() {
    return {
      participantId: this.participantId,
      option: this.option,
      date: this.date,
      surveyId: this.surveyId
    };
  }
}
