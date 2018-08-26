import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewSurveyComponent } from './survey/new-survey/new-survey.component';
import { AdminSurveyComponent } from './survey/admin-survey/admin-survey.component';
import { FindSurveyComponent } from './survey/find-survey/find-survey.component';

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
    path: 'survey/admin',
    component: AdminSurveyComponent
  },
  {
    path: 'survey',
    component: FindSurveyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
