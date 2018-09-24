import { SurveyOption } from '../../../../../server/shared/SurveyOption';
import { DoAnswer } from '../actions/do-answer';
import { Action, State, StateContext } from '@ngxs/store';
import { SurveyAnswer } from '../../../../../server/shared/SurveyAnswer';

@State<SurveyAnswer>({
  name: 'answer',
  defaults: []
})
export class AnswerState {
  @Action(DoAnswer)
  doAnswer(ctx: StateContext<SurveyOption[]>, action: DoAnswer) {
    ctx.setState({});
  }
}

