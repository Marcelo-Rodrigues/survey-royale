import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../../shared/survey.service';
import { AdminSurveyInfo } from '../../shared/messages/admin-survey-info';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

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

    this.routeSubscription = this.route.queryParams.subscribe(params => {
       this.surveyId = params['surveyId'];
       this.conectarAdmin(this.surveyId, localStorage.getItem(AdminSurveyComponent.ADM_PASSWORD);
    });

  }

  conectarAdmin(surveyId: string, password: string) {
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
      this.adminSubscription = null;
    }

    this.adminSubscription = this.surveyService.adminSurvey(new AdminSurveyInfo(surveyId, password))
      .subscribe(message => {
        console.log(message);
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
