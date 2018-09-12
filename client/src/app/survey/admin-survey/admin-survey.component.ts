import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../../shared/survey.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { NewSurveyComponent } from '../new-survey/new-survey.component';
import { CreatedPublicSurveyInfo } from '../../../../../shared/CreatedPublicSurveyInfo';
import { SurveyConnectionInfo } from '../../../../../shared/SurveyConnectionInfo';
import { PendingParticipantsChangeMessage } from '../../shared/messages/pending-participants-change-message';
import { MessageControl } from '../../../../../shared/MessageControl';
import { SurveyInfoMessage } from '../../shared/messages/survey-info-message';
import { ButtonType } from '../../shared/components/button/button-type.enum';

@Component({
  selector: 'app-admin-survey',
  templateUrl: './admin-survey.component.html',
  styleUrls: ['./admin-survey.component.css']
})
export class AdminSurveyComponent implements OnInit, OnDestroy {
  public static ADM_PASSWORD = 'adm_password';
  buttonTypeEnum = ButtonType;
  showResults = false;
  allowResponse = false;
  surveyId: string;
  pendingParticipants: PendingParticipantsChangeMessage;
  routeSubscription: Subscription;
  adminSubscription: Subscription;
  surveyInfo: SurveyInfoMessage;

  constructor(private route: ActivatedRoute, private surveyService: SurveyService) { }

  ngOnInit() {

    this.routeSubscription = this.route.params.subscribe(params => {
       this.surveyId = params.surveyId;
       const storageAdmins: {[key: string]: CreatedPublicSurveyInfo} = JSON.parse(localStorage.getItem(NewSurveyComponent.STORAGE_ADMINS));
      console.log('storageAdmins', storageAdmins, this.surveyId );
       const surveyADMIN = storageAdmins[this.surveyId];

       console.log('surveyADMIN', surveyADMIN);

       this.conectarAdmin(this.surveyId, surveyADMIN.adminPwd);
    });

  }

  conectarAdmin(surveyId: string, password: string) {
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
      this.adminSubscription = null;
    }

    this.adminSubscription = this.surveyService.adminSurvey(new SurveyConnectionInfo(surveyId, 'admin', password))
      .subscribe(msg => {
        switch (msg.type) {
          case MessageControl.ServerMessages.PENDING_PARTICIPANTS_CHANGED_EVENT:
            this.pendingParticipantsChange(msg as PendingParticipantsChangeMessage);
            break;
        }
      }, err => {
        console.error(err);
      });
  }

  pendingParticipantsChange(pendingParticipants: PendingParticipantsChangeMessage) {
    this.pendingParticipants = pendingParticipants;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  allowResponseChanged(event: Event) {
    console.log(this.allowResponse);
  }

  doShowResults() {
    this.showResults = true;
  }

  doResetAnswers() {
    this.surveyService.resetAnswers();
  }
}
