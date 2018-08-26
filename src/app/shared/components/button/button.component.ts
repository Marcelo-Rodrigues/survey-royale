import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonType } from './button-type.enum';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() routerLink = null;
  @Input() disabled = false;
  @Output() click = new EventEmitter();
  @Input() buttonType = ButtonType.default;
  ButtonTypeEnum = ButtonType;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  doClick(event: MouseEvent) {
    if (this.routerLink) {
      this.router.navigate(this.routerLink);
    } else {
      event.cancelBubble = true;
      this.click.emit(event);
    }
  }
}
