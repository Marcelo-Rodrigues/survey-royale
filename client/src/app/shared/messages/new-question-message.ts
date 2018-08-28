import { Message } from './message';

export class NewQuestionMessage implements Message {
  type = 'newQuestion';

  constructor(data) {
  }
}
