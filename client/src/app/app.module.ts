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
import { SurveyService } from './shared/survey.service';
import { LoginComponent } from './survey/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { OptionCardComponent } from './shared/components/option-card/option-card.component';
import { SOCKET_CONFIG_TOKEN, SocketIoService } from './shared/socket-io/socket-io.service';
import { SOCKET_IO_CONFIG_DEFAULT } from './shared/socket-io/socket-io-config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ParticipantComponent } from './survey/controls/participant/participant.component';
import { PendingAnswersComponent } from './survey/controls/pending-answers/pending-answers.component';
import { AnswersSummaryComponent } from './survey/controls/answers-summary/answers-summary.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SurveyAccessInfoComponent } from './survey/controls/survey-access-info/survey-access-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewSurveyComponent,
    AnswerSurveyComponent,
    AdminSurveyComponent,
    ButtonComponent,
    LoginComponent,
    OptionCardComponent,
    ParticipantComponent,
    PendingAnswersComponent,
    AnswersSummaryComponent,
    SurveyAccessInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCheckboxModule
  ],
  providers: [
    SurveyService,
    {
      provide: SOCKET_CONFIG_TOKEN,
      useValue: SOCKET_IO_CONFIG_DEFAULT
    },
    SocketIoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
