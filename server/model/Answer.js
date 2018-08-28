export class Answer {
  constructor(participant, option, date){
    this.participant = participant;
    this.option = option;
    this.date = date;
  }

  get participant() {
    return this.participant;
  }

  get option() {
    return this.option;
  }

  get date() {
    return this.date;
  }
}
