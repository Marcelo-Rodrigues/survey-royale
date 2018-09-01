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
import { PendingParticipantsChangeMessage } from './messages/pending-participants-change-message';
import { SocketIoService } from './socket-io/socket-io.service';

@Injectable()
export class SurveyService {
  constructor(private http: HttpClient, private socketService: SocketIoService) { }

  private socket;

  answer(surveyId: string, option: SurveyOption) {
     if (!this.socket) {
      throw new Error('cannot use closed socket :(');
     }
    this.socket.emit(MessageControl.ClientMessages.ANSWER_EVENT, new SurveyAnswer(surveyId, option).serialize());
  }


  createSurvey(survey: PublicSurveyInfo) {
    return this.http.post<CreatedPublicSurveyInfo>(`${this.socketService.url}api/survey`, survey.serialize());
  }

  enterSurvey(surveyConnectionInfo: SurveyConnectionInfo): Observable<Message> {
    return new Observable(observer => {

      this.socketService.socket.on(MessageControl.ServerMessages.RESETED_ANSWERS_EVENT, (data) => {
        observer.next(new ResetedAnswersMessage());
      });

      this.socketService.socket.on(MessageControl.ServerMessages.SURVEY_INFO_EVENT, (data: CreatedPublicSurveyInfo) => {
        observer.next(new SurveyInfoMessage(data));
      });
console.log(surveyConnectionInfo, surveyConnectionInfo.serialize());
      this.socketService.socket.emit(MessageControl.ClientMessages.ENTER_SURVEY_EVENT, surveyConnectionInfo.serialize());

      return () => {
        this.socket.disconnect();
        this.socket = null;
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
        this.socket.disconnect();
        this.socket = null;
      };
    });
  }
}
