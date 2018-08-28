import { Client } from './model/Client';
import { Answer } from './model/Answer';
import { Utils } from './model/Utils';
import { SurveyOption } from './model/SurveyOption';
import { MessageControl } from './model/MessageControl';
import { DisconnectedClient } from './model/DisconnectedClient';
import { PublicSurveyInfo } from './model/PublicSurveyInfo';
import { PublicClientInfo } from './model/PublicClientInfo';

export class Survey {
  private _participants: { [key: string]: Client };
  private _admins: { [key: string]: Client };
  private _answers: { [key: string]: Answer };
  private _surveyId: string;
  private _adminPwd: string;
  private _date: Date;

  constructor(private _title: string, private _options: SurveyOption[]) {
    this._participants = {};
    this._admins = {};
    this._answers = {};
    this._surveyId = Utils.generateGUID();
    this._adminPwd = Utils.generateGUID();
    this._date = new Date();
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

  public addParticipant(participant: Client) {
    this._participants[participant.participantId] = participant;
  }

  public addAdmin(admin: Client) {
    this._admins[admin.participantId] = admin;
  }

  public answer(answer: Answer) {
    this._answers[answer.participantId] = answer;
    this.emitToAdmins(MessageControl.ServerMessages.CLIENT_ANSWERED_EVENT,
      answer);

    this.emitToAdmins(MessageControl.ServerMessages.PARTICIPANT_PENDING_CHANGE_EVENT,
      this.getPendingParticipants()
        .map(participant => participant.getPublicInfo()));
  }

  public resetAnswers(notifyParticipants = true, notififyAdmins = true) {
    this._answers = {};

    if (notifyParticipants) {
      this.emitToParticipants(
        MessageControl.ServerMessages.RESETED_ANSWER_EVENT
      );
    }

    if (notififyAdmins) {
      this.emitToAdmins(MessageControl.ServerMessages.RESETED_ANSWER_EVENT);
    }
  }

  public isValidAdmin(adminPwd: string) {
    return this.adminPwd === adminPwd;
  }

  public getPublicSurveyInfo() {
    return new PublicSurveyInfo(
      this.date,
      this.surveyId,
      this.title,
      this.options
    );
  }

  public getAdminSurveyInfo() {
    return new PublicSurveyInfo(
      this.date,
      this.surveyId,
      this.title,
      this.options,
      this.adminPwd
    );
  }

  public getPendingParticipants() {
    return Utils.getObjectValues<Client>(this._participants)
      .filter(participant => !this._answers[participant.participantId]);
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

  private removeClient(target: { [key: string]: Client }, clientId: string) {
    const user = target[clientId];
    if (user) {
      const userName = <string>user.name;
      delete target[clientId];

      const remainingParticipants = Utils.getObjectValues<Client>(
        this._participants
      ).map(participants => <string>participants.name);

      this.emitToAdmins(
        MessageControl.ServerMessages.CLIENT_DISCONNECTED_EVENT,
        new DisconnectedClient(userName, remainingParticipants)
      );
    }
  }

  private emitToParticipants(event: string, ...args: any[]) {
    this.emitToClients(this._participants, event, args);
  }

  private emitToAdmins(event: string, ...args: any[]) {
    this.emitToClients(this._admins, event, args);
  }

  private emitToClients(
    target: { [key: string]: Client },
    event: string,
    ...args: any[]
  ) {
    Utils.getObjectValues<Client>(target).forEach(client =>
      client.emit(event, args)
    );
  }
}
