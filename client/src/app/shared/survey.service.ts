import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResetedAnswersMessage } from './messages/reseted-answers-message';
import { Message } from './messages/message';
import { AnswersChangeMessage } from './messages/answers-changed-message';
import { SurveyInfoMessage } from './messages/survey-info-message';
import { MessageControl } from '../../../../shared/MessageControl';
import { HttpClient } from '@angular/common/http';
import { PublicSurveyInfo } from '../../../../shared/PublicSurveyInfo';
import { SurveyConnectionInfo } from '../../../../shared/SurveyConnectionInfo';
import { CreatedPublicSurveyInfo } from '../../../../shared/CreatedPublicSurveyInfo';
import { SurveyAnswer } from '../../../../shared/SurveyAnswer';
import { SurveyOption } from '../../../../shared/SurveyOption';
import { LockedSurveyState } from '../../../../shared/LockedSurveyState';
import { PendingParticipantsChangeMessage } from './messages/pending-participants-change-message';
import { SocketIoService } from './socket-io/socket-io.service';

@Injectable()
export class SurveyService {
  constructor(private http: HttpClient, private socketService: SocketIoService) { }

  resetAnswers() {
    this.socketService.socket.emit(MessageControl.ClientMessages.RESET_ANSWER_EVENT);
  }

  answer(surveyId: string, option: SurveyOption) {
    this.socketService.socket.emit(MessageControl.ClientMessages.ANSWER_EVENT, new SurveyAnswer(surveyId, option).toJSON());
  }

  createSurvey(survey: PublicSurveyInfo) {
    return this.http.post<CreatedPublicSurveyInfo>(`${this.socketService.url}api/survey`, survey.toJSON());
  }

  getResetedAnswerEvent(): Observable<ResetedAnswersMessage>  {
    return this.createObservable(
      MessageControl.ServerMessages.RESETED_ANSWERS_EVENT,
      (data) => new ResetedAnswersMessage());
  }

  subscribe(): Observable<ResetedAnswersMessage>  {
    return this.createObservable(
      MessageControl.ServerMessages.RESETED_ANSWERS_EVENT,
      (data) => new ResetedAnswersMessage());
  }

  createObservable<T>(event, deSerializeFunction: (data: T) => T): Observable<T> {
    return new Observable(observer => {
      const emitter = this.socketService.socket.on(event, (data) => {
        observer.next(deSerializeFunction(data));
      });
      return () => {
        emitter.removeEventListener(event);
      };
    });
  }

  lockSurvey(surveyId: string, locked: boolean, adminPwd: string) {
    this.socketService.socket.emit(MessageControl.ClientMessages.LOCK_SURVEY_EVENT,
       new LockedSurveyState(surveyId, locked, adminPwd).toJSON());
  }

  enterSurvey(surveyConnectionInfo: SurveyConnectionInfo): Observable<Message> {
    return new Observable(observer => {

      this.socketService.socket.on(MessageControl.ServerMessages.RESETED_ANSWERS_EVENT, (data) => {
        observer.next(new ResetedAnswersMessage());
      });

      this.socketService.socket.on(MessageControl.ServerMessages.SURVEY_INFO_EVENT, (data: CreatedPublicSurveyInfo) => {
        observer.next(new SurveyInfoMessage(data));
      });
console.log(surveyConnectionInfo, surveyConnectionInfo.toJSON());
      this.socketService.socket.emit(MessageControl.ClientMessages.ENTER_SURVEY_EVENT, surveyConnectionInfo.toJSON());

      return () => {
        // this.socket.disconnect();
        // this.socket = null;
      };
    });
  }


  adminSurvey(adminInfo): Observable<Message> {
    return new Observable(observer => {

      this.socketService.socket.on(MessageControl.ServerMessages.RESETED_ANSWERS_EVENT, (data) => {
        observer.next(new ResetedAnswersMessage());
      });

      this.socketService.socket.on(MessageControl.ServerMessages.ANSWERS_CHANGED_EVENT, (data) => {
        observer.next(new AnswersChangeMessage(data));
      });

      this.socketService.socket.on(MessageControl.ServerMessages.PENDING_PARTICIPANTS_CHANGED_EVENT, (data) => {
        observer.next(new PendingParticipantsChangeMessage(data));
      });

      this.socketService.socket.emit(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT, adminInfo);

      return () => {
        // this.socket.disconnect();
        // this.socket = null;
      };
    });
  }
}
