import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() {}

  textChanged(event) {
    this.textChange.emit(event);
  }

  ngOnInit() {}
}
