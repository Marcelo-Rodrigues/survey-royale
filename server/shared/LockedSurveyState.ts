import { ISerializable } from './Serializable';

export class LockedSurveyState implements ISerializable {
  constructor(public surveyId: string,
              public locked: boolean,
              public adminPwd?: string) { }

  public toJSON(): object {
    return {
      adminPwd: this.adminPwd,
      locked: this.locked,
      surveyId: this.surveyId,
    };
  }
}
