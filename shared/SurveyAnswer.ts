import { Serializable } from "./Serializable";
import { SurveyOption } from "./SurveyOption";

export class SurveyAnswer implements Serializable {
  constructor(public surveyId: string, public option: SurveyOption) { }

  serialize() {
    return {
      surveyId: this.surveyId,
      option: this.option.serialize()
    };
  }

}
