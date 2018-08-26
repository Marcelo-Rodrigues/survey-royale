import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewSurveyComponent } from './survey/new-survey/new-survey.component';
import { FindSurveyComponent } from './survey/find-survey/find-survey.component';
import { AdminSurveyComponent } from './survey/admin-survey/admin-survey.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { TypeSurveyService } from './type-survey.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewSurveyComponent,
    FindSurveyComponent,
    AdminSurveyComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    TypeSurveyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
