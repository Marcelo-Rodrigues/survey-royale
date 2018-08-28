import { Serializable } from './Serializable'

export class DisconnectedClient implements Serializable {
   constructor(public participantName: string, public remainingParticipants: string[]) {}

   public serialize() {
       return {
           participantName: this.participantName,
           remainingParticipants: this.remainingParticipants
        }
   }
}
