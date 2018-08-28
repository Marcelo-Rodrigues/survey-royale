import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonType } from '../../shared/components/button/button-type.enum';
import { SurveyService } from '../../shared/survey.service';
import { SurveyOption } from '../../../../../shared/SurveyOption';
import { PublicSurveyInfo } from '../../../../../shared/PublicSurveyInfo';

@Component({
  selector: 'app-new-survey',
  templateUrl: './new-survey.component.html',
  styleUrls: ['./new-survey.component.css']
})
export class NewSurveyComponent implements OnInit {
  @Input()
  text: string;
  @Output()
  textChange = new EventEmitter<string>();
  ButtonTypeEnum = ButtonType;

  title = '';
  options: SurveyOption[] = [];
  newOptionTitle = '';
  createdSurvey: PublicSurveyInfo = null;

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
      .subscribe((survey) => {
        this.createdSurvey = survey;
      });
    }
  }

  isValid() {
    return this.options.length > 1 && this.title.trim();
  }
}
