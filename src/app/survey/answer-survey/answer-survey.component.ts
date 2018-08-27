import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { SurveyService } from '../../shared/survey.service';
import { Subscription } from 'rxjs/Subscription';
import { MessageType } from '../../shared/messages/message-type';
import { SurveyInfoMessage } from '../../shared/messages/survey-info-message';
import { AnswerMessage } from '../../shared/messages/answer-message';

@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.css']
})
export class AnswerSurveyComponent implements OnInit, OnDestroy {

  pendingAnswer = false;
  subscription: Subscription;
  surveyInfo: SurveyInfoMessage;

  constructor(private router: Router, private surveyService: SurveyService) { }

  ngOnInit() {
    const participantName = localStorage.getItem(LoginComponent.PARTICIPANT_NAME);
    if (participantName) {
      this.subscription = this.surveyService.enterSurvey(participantName)
        .subscribe((msg) => {
          switch (msg.type) {
            case MessageType.surveyInfo:
              this.newSurveyInfo(<SurveyInfoMessage>msg);
              break;
            case MessageType.newQuestion:
              this.newQuestion();
              break;
          }
        });
    } else {
      this.router.navigateByUrl('/login');
    }

  }

  newSurveyInfo(surveyInfo: SurveyInfoMessage) {
    this.surveyInfo = surveyInfo;
  }

  newQuestion() {
    this.pendingAnswer = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onOptionChange(newOpion) {
    this.surveyService.answer(newOpion);
  }

}
