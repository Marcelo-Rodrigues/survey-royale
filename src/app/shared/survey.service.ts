import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { NewQuestionMessage } from './messages/new-question-message';
import { Message } from './messages/message';
import { AnswerMessage } from './messages/answer-message';
import { MessageType } from './messages/message-type';
import { SurveyInfoMessage } from './messages/survey-info-message';

@Injectable()
export class SurveyService {

  constructor() { }

  private url = 'http://localhost:8090/';
  private socket;

  answer(answer) {
     if (!this.socket) {
      throw new Error('cannot use closed socket :(');
     }
    this.socket.emit('answer', answer);
  }

  private getSocket() {
    if (!this.socket) {
      this.socket = io(this.url);
    }

    return this.socket;
  }

  enterSurvey(name): Observable<Message> {
    return new Observable(observer => {

      this.getSocket().on(MessageType.newQuestion, (data) => {
        observer.next(new NewQuestionMessage(data));
      });

      this.getSocket().on(MessageType.surveyInfo, (data) => {
        observer.next(new SurveyInfoMessage(data));
      });

      this.getSocket().emit('enterSurvey',{name:name});

      return () => {
        this.socket.disconnect();
        this.socket = null;
      };
    });
  }


  adminSurvey(adminInfo): Observable<Message> {
    return new Observable(observer => {

      this.getSocket().on('newQuestion', (data) => {
        observer.next(new NewQuestionMessage(data));
      });

      this.getSocket().on('answer', (data) => {
        observer.next(new AnswerMessage(data));
      });

      this.getSocket().emit('adminSurvey', adminInfo);

      return () => {
        this.socket.disconnect();
        this.socket = null;
      };
    });
  }
}
