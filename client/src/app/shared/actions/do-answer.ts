import { SurveyOption } from '../../../../../server/shared/SurveyOption';

export class DoAnswer {
  static readonly type = '[answer] Do Answer';

  constructor(public answer: SurveyOption) {}
}
