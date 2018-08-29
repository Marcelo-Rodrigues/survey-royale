import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { NewQuestionMessage } from './messages/new-question-message';
import { Message } from './messages/message';
import { AnswerMessage } from './messages/answer-message';
import { SurveyInfoMessage } from './messages/survey-info-message';
import { MessageControl } from '../../../../shared/MessageControl';
import { HttpClient } from '@angular/common/http';
import { PublicSurveyInfo } from '../../../../shared/PublicSurveyInfo';
import { SurveyConnectionInfo } from '../../../../shared/SurveyConnectionInfo';
import { CreatedPublicSurveyInfo } from '../../../../shared/CreatedPublicSurveyInfo';
import { SurveyAnswer } from '../../../../shared/SurveyAnswer';
import { SurveyOption } from '../../../../shared/SurveyOption';

@Injectable()
export class SurveyService {
  constructor(private http: HttpClient) { }

  private url = 'http://localhost:8090/';
  private socket;

  answer(surveyId: string, option: SurveyOption) {
     if (!this.socket) {
      throw new Error('cannot use closed socket :(');
     }
    this.socket.emit(MessageControl.ClientMessages.ANSWER_EVENT, new SurveyAnswer(surveyId, option).serialize());
  }

  private getSocket() {
    if (!this.socket) {
      this.socket = io(this.url);
    }

    return this.socket;
  }

  createSurvey(survey: PublicSurveyInfo) {
    return this.http.post<CreatedPublicSurveyInfo>(`${this.url}api/survey`, survey.serialize());
  }

  enterSurvey(surveyConnectionInfo: SurveyConnectionInfo): Observable<Message> {
    return new Observable(observer => {

      this.getSocket().on(MessageControl.ServerMessages.RESETED_ANSWER_EVENT, (data) => {
        observer.next(new NewQuestionMessage(data));
      });

      this.getSocket().on(MessageControl.ServerMessages.SURVEY_INFO_EVENT, (data: CreatedPublicSurveyInfo) => {
        observer.next(new SurveyInfoMessage(data));
      });
console.log(surveyConnectionInfo, surveyConnectionInfo.serialize());
      this.getSocket().emit(MessageControl.ClientMessages.ENTER_SURVEY_EVENT, surveyConnectionInfo.serialize());

      return () => {
        this.socket.disconnect();
        this.socket = null;
      };
    });
  }


  adminSurvey(adminInfo): Observable<Message> {
    return new Observable(observer => {

      this.getSocket().on(MessageControl.ServerMessages.RESETED_ANSWER_EVENT, (data) => {
        observer.next(new NewQuestionMessage(data));
      });

      this.getSocket().on(MessageControl.ServerMessages.ANSWERS_CHANGE_EVENT, (data) => {
        observer.next(new AnswerMessage(data));
      });

      this.getSocket().emit(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT, adminInfo);

      return () => {
        this.socket.disconnect();
        this.socket = null;
      };
    });
  }
}
