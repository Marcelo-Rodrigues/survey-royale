import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending-answers',
  templateUrl: './pending-answers.component.html',
  styleUrls: ['./pending-answers.component.css']
})
export class PendingAnswersComponent implements OnInit {

  pendingParticipants: any[] = [{name: 'Participante 1'}];//[{name: 'Participante 1'}, {name: 'Participante 2'},
  //{name: 'Participante 3'}];
  answeredParticipants: any[]=[{name: 'Participante 1'}, {name: 'Participante 2'},
  {name: 'Participante 3'},{name: 'Participante 1'}, {name: 'Participante 2'},
  {name: 'Participante 3'},{name: 'Participante 1'}, {name: 'Participante 2'},
  {name: 'Participante 3'},{name: 'Participante 1'}, {name: 'Participante 2'},
  {name: 'Participante 3'}];//[{name: 'respondao'}];

  get totalParticipants() {
    return this.pendingParticipants.length + this.answeredParticipants.length;
  }

  constructor() { }

  ngOnInit() {
  }
}
