import { ISerializable } from './Serializable';

export class SurveyConnectionInfo implements ISerializable {
  constructor(public surveyId: string, public participantName: string, public adminPwd?: string) {}

  public toJSON() {
    return {
      adminPwd: this.adminPwd,
      participantName: this.participantName,
      surveyId: this.surveyId,
    };
  }
}
