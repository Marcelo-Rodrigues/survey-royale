import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewSurveyComponent } from './survey/new-survey/new-survey.component';
import { AdminSurveyComponent } from './survey/admin-survey/admin-survey.component';
import { AnswerSurveyComponent } from './survey/answer-survey/answer-survey.component';
import { LoginComponent } from './survey/login/login.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'survey/new',
    component: NewSurveyComponent
  },
  {
    path: 'surveyadmin/:id',
    component: AdminSurveyComponent
  },
  {
    path: 'survey/:id',
    component: AnswerSurveyComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
