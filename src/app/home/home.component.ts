import { Component, OnInit } from '@angular/core';
import { ButtonType } from '../shared/components/button/button-type.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ButtonTypeEnum = ButtonType;
  
  constructor() { }

  ngOnInit() {
  }

}
