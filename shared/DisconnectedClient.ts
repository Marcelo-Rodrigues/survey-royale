import { Serializable } from './Serializable'

export class DisconnectedClient implements Serializable {
   constructor(public participantName: string, public remainingParticipants: string[]) {}

   public toJSON() {
       return {
           participantName: this.participantName,
           remainingParticipants: this.remainingParticipants
        }
   }
}
