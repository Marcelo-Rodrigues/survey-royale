import { PublicSurveyInfo } from './PublicSurveyInfo';
import { SurveyOption } from './SurveyOption';
import { Serializable } from './Serializable'

export class CreatedPublicSurveyInfo extends PublicSurveyInfo implements Serializable {
    constructor(title: string,
        options: SurveyOption[],
        public date: Date,
        public isLocked: boolean,
        public surveyId: string,
        public adminPwd?: string
        ) {

        super(title, options, isLocked);

    }

    toJSON() {
        return {
            options: this.options.map(option => option.toJSON()),
            date: this.date,
            surveyId: this.surveyId,
            adminPwd: this.adminPwd,
            title: this.title,
            isLocked: this.isLocked
        };
    }
}
