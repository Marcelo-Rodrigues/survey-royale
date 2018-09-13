import { Component, OnInit, Input } from '@angular/core';
import { SurveyOption } from '../../../../../../server/shared/SurveyOption';

@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.css']
})
export class OptionCardComponent implements OnInit {
  @Input() option: SurveyOption;

  constructor() { }

  ngOnInit() {
  }

}
