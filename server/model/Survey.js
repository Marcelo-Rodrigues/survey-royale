export class Survey {

  constructor(title, options) {
    this.title = title;
    this.options= options;
  }

  set password(surveyId) {
    this.surveyId = surveyId;
  }

  get password() {
    return this.surveyId;
  }

  set adminPwd(surveyId) {
    this.adminPwd = adminPwd;
  }

  get adminPwd() {
    return this.adminPwd;
  }
}
