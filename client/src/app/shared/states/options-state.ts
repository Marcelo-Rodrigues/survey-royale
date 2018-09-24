import { State } from '@ngxs/store';
import { SurveyOption } from '../../../../../server/shared/SurveyOption';

@State<SurveyOption[]>({
  name: 'options',
  defaults: []
})
export class OptionsState {}
