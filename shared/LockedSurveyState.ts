import { Serializable } from "./Serializable";

export class LockedSurveyState implements Serializable {
  constructor(public surveyId: string,
    public locked: boolean,
    public adminPwd?: string) { }

  toJSON(): object {
    return {
      surveyId: this.surveyId,
      locked: this.locked,
      adminPwd: this.adminPwd
    };
  }
}
