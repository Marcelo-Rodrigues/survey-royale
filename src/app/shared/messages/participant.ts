export class Participant {
  public id: string;
  public name: string;

  constructor(participant) {
    this.id = participant.id;
    this.name = participant.name;
  }
}
