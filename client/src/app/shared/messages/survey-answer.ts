export class SurveyAnswer {
  public date: Date;
  public answer;

  constructor(data?) {
    if(data) {
      this.date = data.date;
      this.answer = new Date(data.answer);
    }
  }
}
