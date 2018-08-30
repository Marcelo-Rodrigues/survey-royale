export module MessageControl {
  export class ServerMessages {
    public static RESETED_ANSWERS_EVENT = 'resetedAnswer';
    public static CLIENT_DISCONNECTED_EVENT = 'clientDisconnected';
    public static ANSWERS_CHANGED_EVENT = 'anwersChanged';
    public static PENDING_PARTICIPANTS_CHANGED_EVENT = 'participantPendingChange';
    public static SURVEY_INFO_EVENT = 'surveyInfo';
  }

  export class ServerErrorDescription {
    public static SURVEY_NOT_FOUND_ERR = (surveyId: string) => {
        return { id: 1, message: 'Survey não encontrado', surveyId: surveyId };
    }

    public static ADMIN_INVALID_PWD = () => {
      return { id: 2, message: 'Senha de admin inválida' };
    }
  }

  export class ClientMessages {
    public static ENTER_SURVEY_EVENT = 'enterSurvey';
    public static ADMINISTRATE_SURVEY_EVENT = 'adminSurvey';
    public static RESET_ANSWER_EVENT = 'resetAnswer';
    public static NEW_QUESTION_EVENT = 'newQuestion';
    public static ANSWER_EVENT = 'answer';
    public static DISCONNECT_EVENT = 'disconnect';
  }
}
