import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../shared/survey.service';
import { Subscription } from 'rxjs/Subscription';
import { SurveyInfoMessage } from '../../shared/messages/survey-info-message';
import { SurveyConnectionInfo } from '../../../../../shared/SurveyConnectionInfo';
import { MessageControl } from '../../../../../shared/MessageControl';
import { SurveyOption } from '../../../../../shared/SurveyOption';

@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.css']
})
export class AnswerSurveyComponent implements OnInit, OnDestroy {

  pendingAnswer = false;
  subscription: Subscription;
  surveyInfo: SurveyInfoMessage;
  participantName = '';

  constructor(private activateRoute: ActivatedRoute, private router: Router, private surveyService: SurveyService) { }

  ngOnInit() {
    this.participantName = localStorage.getItem(LoginComponent.PARTICIPANT_NAME);
    if (!this.participantName) {
      this.router.navigateByUrl('/login');
    } else {
      this.activateRoute.params.subscribe((param) => this.connect(param.surveyId));
    }
  }

  connect(surveyId: string) {

    if (this.participantName) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.surveyService.enterSurvey(new SurveyConnectionInfo(surveyId, this.participantName))
        .subscribe((msg) => {
          switch (msg.type) {
            case MessageControl.ServerMessages.SURVEY_INFO_EVENT:
              this.newSurveyInfo(msg as SurveyInfoMessage);
              break;
            case MessageControl.ServerMessages.RESETED_ANSWERS_EVENT:
              this.resetAnswer();
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

  resetAnswer() {
    this.pendingAnswer = true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onOptionChange(newOption: SurveyOption) {
    this.surveyService.answer(this.surveyInfo.surveyId, newOption);
  }

}
