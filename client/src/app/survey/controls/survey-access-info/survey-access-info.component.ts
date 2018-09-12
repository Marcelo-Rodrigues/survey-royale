import { Component, OnInit, Input } from '@angular/core';
import { CreatedPublicSurveyInfo } from '../../../../../../shared/CreatedPublicSurveyInfo';

@Component({
  selector: 'app-survey-access-info',
  templateUrl: './survey-access-info.component.html',
  styleUrls: ['./survey-access-info.component.css']
})
export class SurveyAccessInfoComponent implements OnInit {


  @Input() createdSurvey: CreatedPublicSurveyInfo = null;
  constructor() { }

  ngOnInit() {
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  getSurveyUrl() {
    const url = window.location.href;
    const baseUrl = /(^.*)(survey\/new)$/g.exec(url)[1];
    return baseUrl + 'login?surveyId=' + this.createdSurvey.surveyId;
  }
}
