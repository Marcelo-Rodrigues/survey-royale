import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewSurveyComponent } from './survey/new-survey/new-survey.component';
import { AnswerSurveyComponent } from './survey/answer-survey/answer-survey.component';
import { AdminSurveyComponent } from './survey/admin-survey/admin-survey.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { TypeSurveyService } from './type-survey.service';
import { SurveyService } from './shared/survey.service';
import { LoginComponent } from './survey/login/login.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewSurveyComponent,
    AnswerSurveyComponent,
    AdminSurveyComponent,
    ButtonComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    TypeSurveyService,
    SurveyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
