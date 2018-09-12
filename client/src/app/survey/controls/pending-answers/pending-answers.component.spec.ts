import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAnswersComponent } from './pending-answers.component';

describe('PendingAnswersComponent', () => {
  let component: PendingAnswersComponent;
  let fixture: ComponentFixture<PendingAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
