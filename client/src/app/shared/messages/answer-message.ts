import { Message } from './message';
import { PublicAnswerInfo } from '../../../../../shared/PublicAnswerInfo';
import { PublicClientInfo } from '../../../../../shared/PublicClientInfo';

export class AnswerMessage implements Message {
  type = 'answer';
  public answers: PublicAnswerInfo[];
  public pendingParticipants: PublicClientInfo[];

  constructor(data: PublicAnswerInfo[]) {
    this.answers = [];
    this.pendingParticipants = [];

    if (data) {
      this.answers = Object.values(data).map(answer =>
        new PublicAnswerInfo(answer.surveyId, answer.participantId, answer.option));
    }
  }
}
