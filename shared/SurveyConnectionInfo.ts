import { Serializable } from "./Serializable";

export class SurveyConnectionInfo implements Serializable {
  constructor(public surveyId: string, public participantName: string, public adminPwd?: string) {}

  public serialize() {
    return {
      surveyId: this.surveyId,
      participantName: this.participantName,
      adminPwd: this.adminPwd
    }
  }
}
