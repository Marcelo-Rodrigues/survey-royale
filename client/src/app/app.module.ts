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
import { SocketIoConfig } from './shared/socket-io/socket-io-config';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewSurveyComponent,
    AnswerSurveyComponent,
    AdminSurveyComponent,
    ButtonComponent,
    LoginComponent,
    OptionCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    SurveyService,
    {
      provide: SOCKET_CONFIG_TOKEN,
      useValue: SocketIoConfig.SOCKET_IO_CONFIG_DEFAULT
    },
    SocketIoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
