import { Message } from './message';
import { PublicClientInfo } from '../../../../../server/shared/PublicClientInfo';
import { MessageControl } from '../../../../../server/shared/MessageControl';

export class PendingParticipantsChangeMessage implements Message {
  type = MessageControl.ServerMessages.PENDING_PARTICIPANTS_CHANGED_EVENT;
  public pendingParticipants: PublicClientInfo[];

  constructor(data: PublicClientInfo[]) {

    if (data) {
      this.pendingParticipants = data.map(pendingParticipant =>
        new PublicClientInfo(pendingParticipant.id, pendingParticipant.name));
    } else {
      this.pendingParticipants = [];
    }
  }
}
