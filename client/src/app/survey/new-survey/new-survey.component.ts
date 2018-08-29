import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonType } from '../../shared/components/button/button-type.enum';
import { SurveyService } from '../../shared/survey.service';
import { SurveyOption } from '../../../../../shared/SurveyOption';
import { PublicSurveyInfo } from '../../../../../shared/PublicSurveyInfo';
import { CreatedPublicSurveyInfo } from '../../../../../shared/CreatedPublicSurveyInfo';

@Component({
  selector: 'app-new-survey',
  templateUrl: './new-survey.component.html',
  styleUrls: ['./new-survey.component.css']
})
export class NewSurveyComponent implements OnInit {
  public static STORAGE_ADMINS = 'storageAdmins';

  @Input()
  text: string;
  @Output()
  textChange = new EventEmitter<string>();
  ButtonTypeEnum = ButtonType;

  title = '';
  options: SurveyOption[] = [];
  newOptionTitle = '';
  createdSurvey: CreatedPublicSurveyInfo = null;

  constructor(private surveyService: SurveyService) {}

  textChanged(event) {
    this.textChange.emit(event);
  }

  ngOnInit() {}

  addOption() {
    if (this.options.findIndex(option => option.title === this.newOptionTitle) === -1) {
      this.options.push(new SurveyOption(this.newOptionTitle));
    }
    this.newOptionTitle = '';
  }

  removeOption(option) {
    console.log(option);
    const optionIndex = this.options.indexOf(option);
    if (optionIndex > -1) {
      this.options.splice(optionIndex, 1);
    }
  }

  createSurvey() {
    if (this.isValid()) {
      this.surveyService.createSurvey(new PublicSurveyInfo(this.title, this.options))
      .subscribe((createdSurvey: CreatedPublicSurveyInfo) => {
        this.createdSurvey = new CreatedPublicSurveyInfo(createdSurvey.title,
          createdSurvey.options,
          createdSurvey.date,
          createdSurvey.surveyId,
          createdSurvey.adminPwd);

        let storageAdmins: {[key: string]: CreatedPublicSurveyInfo} = JSON.parse(localStorage.getItem('surveyAdminInfo'));

        if (!storageAdmins) {
          storageAdmins = {};
        }

        storageAdmins[createdSurvey.surveyId] = this.createdSurvey;

        const serializedStorageAdmins: {[key: string]: {}} = {};

        Object.values(storageAdmins).forEach(surveyAdmin => serializedStorageAdmins[surveyAdmin.surveyId] = surveyAdmin.serialize());

        localStorage.setItem(NewSurveyComponent.STORAGE_ADMINS, JSON.stringify(serializedStorageAdmins));
      });
    }
  }

  getSurveyUrl() {
    const url = window.location.href;
    const baseUrl = /(^.*)(\/new)$/g.exec(url)[1];
    return baseUrl + '/' + this.createdSurvey.surveyId;
  }

  isValid() {
    return this.options.length > 1 && this.title.trim();
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
