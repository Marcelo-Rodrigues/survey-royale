import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../shared/survey.service';
import { Subscription } from 'rxjs/Subscription';
import { SurveyInfoMessage } from '../../shared/messages/survey-info-message';
import { SurveyConnectionInfo } from '../../../../../shared/SurveyConnectionInfo';
import { MessageControl } from '../../../../../shared/MessageControl';

@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.css']
})
export class AnswerSurveyComponent implements OnInit, OnDestroy {

  pendingAnswer = false;
  subscription: Subscription;
  surveyInfo: SurveyInfoMessage;

  constructor(private activateRoute: ActivatedRoute, private router: Router, private surveyService: SurveyService) { }

  ngOnInit() {

    this.activateRoute.params.subscribe((param) =>{
      console.log(param);
       this.connect(param.surveyId);
      });

  }

  connect(surveyId: string) {
    const participantName = localStorage.getItem(LoginComponent.PARTICIPANT_NAME);
    if (!participantName) {
      this.router.navigateByUrl('/login');
    }

    if (participantName) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
console.log(new SurveyConnectionInfo(surveyId, participantName));
      this.subscription = this.surveyService.enterSurvey(new SurveyConnectionInfo(surveyId, participantName))
        .subscribe((msg) => {
          switch (msg.type) {
            case MessageControl.ServerMessages.SURVEY_INFO_EVENT:
              this.newSurveyInfo(<SurveyInfoMessage>msg);
              break;
            case MessageControl.ServerMessages.RESETED_ANSWER_EVENT:
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
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }

  onOptionChange(newOpion) {
    this.surveyService.answer(newOpion);
  }

}
