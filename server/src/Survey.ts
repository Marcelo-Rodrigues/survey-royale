import { isArray } from 'util';
import { CreatedPublicSurveyInfo } from '../shared/CreatedPublicSurveyInfo';
import { DisconnectedClient } from '../shared/DisconnectedClient';
import { LockedSurveyState } from '../shared/LockedSurveyState';
import { MessageControl } from '../shared/MessageControl';
import { PublicAnswerInfo } from '../shared/PublicAnswerInfo';
import { ISerializable } from '../shared/Serializable';
import { SurveyOption } from '../shared/SurveyOption';
import { Client } from './Client';
import { Utils } from './Utils';

export class Survey {
  private _participants: { [key: string]: Client };
  private _admins: { [key: string]: Client };
  private _answers: { [key: string]: PublicAnswerInfo };
  private _surveyId: string;
  private _adminPwd: string;
  private _date: Date;
  private _isLocked: boolean;

  constructor(private _title: string, private _options: SurveyOption[]) {
    this._participants = {};
    this._admins = {};
    this._answers = {};
    this._surveyId = Utils.generateGUID();
    this._adminPwd = Utils.generateGUID();
    this._date = new Date();
    this._isLocked = true;
  }

  public resetAnswers() {
    this._answers = {};

    this.emitToParticipants(MessageControl.ServerMessages.RESETED_ANSWERS_EVENT);
    this.emitToAdmins(MessageControl.ServerMessages.RESETED_ANSWERS_EVENT);
    this.sendEventChangedPendingParticipants();
  }

  public isValidAdmin(adminPwd: string) {
    return this.adminPwd === adminPwd;
  }

  public getPublicSurveyInfo() {
    return new CreatedPublicSurveyInfo(
      this.title,
      this.options,
      this.date,
      this.isLocked,
      this.surveyId,
    );
  }

  public getAdminPublicSurveyInfo() {
    return new CreatedPublicSurveyInfo(
      this.title,
      this.options,
      this.date,
      this.isLocked,
      this.surveyId,
      this.adminPwd,
    );
  }

  public getPendingParticipants() {
    return Utils.getObjectValues<Client>(this._participants)
      .filter((participant) => !this._answers[participant.participantId]);
  }

  public removeAll(clientId: string): any {
    this.removeParticipant(clientId);
    this.removeAdmin(clientId);
  }

  public removeParticipant(clientId: string) {
    this.removeClient(this._participants, clientId);
  }

  public removeAdmin(clientId: string) {
    this.removeClient(this._admins, clientId);
  }

  public setLockSurveyState(lockedState: LockedSurveyState): any {
    throw new Error('Method not implemented.');
  }

  get surveyId() {
    return this._surveyId;
  }

  get adminPwd() {
    return this._adminPwd;
  }

  get title() {
    return this._title;
  }

  get date() {
    return this._date;
  }

  get options() {
    return this._options;
  }

  get isLocked() {
    return this._isLocked;
  }

  public addParticipant(participant: Client) {
    this._participants[participant.participantId] = participant;
  }

  public addAdmin(admin: Client) {
    this._admins[admin.participantId] = admin;
  }

  public answer(answer: PublicAnswerInfo) {
    this._answers[answer.participantId] = answer;
    this.emitToAdmins(MessageControl.ServerMessages.ANSWERS_CHANGED_EVENT,
    Utils.getObjectValues(this._answers));
    this.sendEventChangedPendingParticipants();
  }

  private sendEventChangedPendingParticipants(): void {
    this.emitToAdmins(MessageControl.ServerMessages.PENDING_PARTICIPANTS_CHANGED_EVENT,
    this.getPendingParticipants().map((participant) => participant.getPublicInfo()));
  }

  private removeClient(target: { [key: string]: Client }, clientId: string) {
    const user = target[clientId];
    if (user) {
      const userName = user.name as string;
      delete target[clientId];

      const remainingParticipants = Utils.getObjectValues<Client>(
        this._participants,
      ).map((participants) => participants.name as string);

      this.emitToAdmins(
        MessageControl.ServerMessages.CLIENT_DISCONNECTED_EVENT,
        new DisconnectedClient(userName, remainingParticipants),
      );
    }
  }

  private emitToParticipants(event: string, obj?: ISerializable | ISerializable[]) {
    this.emitToClients(this._participants, event, obj);
  }

  private emitToAdmins(event: string, obj?: ISerializable | ISerializable[]) {
    this.emitToClients(this._admins, event, obj);
  }

  private emitToClients(
    target: { [key: string]: Client },
    event: string,
    objects?: ISerializable | ISerializable[],
  ) {
    let emitFunction: (client: Client) => any;

    if (objects) {
      const serializedObjects =
      isArray(objects) ?
        (objects as ISerializable[]).map((obj) => obj.toJSON())
        : (objects as ISerializable).toJSON();

      emitFunction = (client) => client.emit(event, serializedObjects);

    } else {
      emitFunction = (client) => client.emit(event);
    }

    Utils.getObjectValues<Client>(target).forEach(emitFunction);
  }
}
