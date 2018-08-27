import { Message } from './message';
import { SurveyAnswer } from './survey-answer';
import { Participant } from './participant';

export class AnswerMessage  implements Message {
  type = 'answer';
  public answers: SurveyAnswer[];
  public pendingParticipants: Participant[];

  constructor(data: AnswerMessage) {
    this.answers = [];
    this.pendingParticipants = [];

    if (data) {
      Object.values(data.answers).forEach(answer => new SurveyAnswer(answer));
      data.pendingParticipants.forEach(pendingParticipant =>
        this.pendingParticipants.push(new Participant(pendingParticipant))
      );
    }
  }
}
