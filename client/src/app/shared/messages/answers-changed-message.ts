import { Message } from './message';
import { PublicAnswerInfo } from '../../../../../server/shared/PublicAnswerInfo';
import { MessageControl } from '../../../../../server/shared/MessageControl';

export class AnswersChangeMessage implements Message {
  type = MessageControl.ServerMessages.ANSWERS_CHANGED_EVENT;
  public answers: PublicAnswerInfo[];

  constructor(data: PublicAnswerInfo[]) {
    this.answers = [];

    if (data) {
      this.answers = Object.values(data).map(answer =>
        new PublicAnswerInfo(answer.surveyId, answer.participantId, answer.option));
    }
  }
}
