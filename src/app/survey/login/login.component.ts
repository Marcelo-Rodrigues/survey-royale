import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public static PARTICIPANT_NAME = 'participantName';

  name: string;
  surveyId: string;
  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
       this.surveyId = params['surveyId'];
    });
    this.name = localStorage.getItem(LoginComponent.PARTICIPANT_NAME);
  }

  login() {
    localStorage.setItem(LoginComponent.PARTICIPANT_NAME, this.name);
    this.router.navigateByUrl(`/survey/${this.surveyId}`);
  }

}
