import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../../shared/survey.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { NewSurveyComponent } from '../new-survey/new-survey.component';
import { CreatedPublicSurveyInfo } from '../../../../../shared/CreatedPublicSurveyInfo';
import { SurveyConnectionInfo } from '../../../../../shared/SurveyConnectionInfo';

@Component({
  selector: 'app-admin-survey',
  templateUrl: './admin-survey.component.html',
  styleUrls: ['./admin-survey.component.css']
})
export class AdminSurveyComponent implements OnInit, OnDestroy {
  public static ADM_PASSWORD = 'adm_password';
  exibirResultado = true;
  surveyId: string;
  routeSubscription: Subscription;
  adminSubscription: Subscription;

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
      .subscribe(message => {
        console.log(message);
      }, err => {
        console.error(err);
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
