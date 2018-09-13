import { ISerializable } from './Serializable';

export class DisconnectedClient implements ISerializable {
   constructor(public participantName: string, public remainingParticipants: string[]) {}

   public toJSON() {
       return {
           participantName: this.participantName,
           remainingParticipants: this.remainingParticipants,
        };
   }
}
