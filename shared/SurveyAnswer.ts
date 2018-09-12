import { Serializable } from "./Serializable";
import { SurveyOption } from "./SurveyOption";

export class SurveyAnswer implements Serializable {
  constructor(public surveyId: string, public option: SurveyOption) { }

  toJSON() {
    return {
      surveyId: this.surveyId,
      option: this.option.toJSON()
    };
  }

}
