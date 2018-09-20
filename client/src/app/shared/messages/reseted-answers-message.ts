import { Message } from './message';
import { MessageControl } from '../../../../../server/shared/MessageControl';

export class ResetedAnswersMessage implements Message {
  type = MessageControl.ServerMessages.RESETED_ANSWERS_EVENT;
}
