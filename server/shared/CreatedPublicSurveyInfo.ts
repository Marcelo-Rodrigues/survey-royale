import { PublicSurveyInfo } from './PublicSurveyInfo';
import { ISerializable } from './Serializable';
import { SurveyOption } from './SurveyOption';

export class CreatedPublicSurveyInfo extends PublicSurveyInfo implements ISerializable {
    constructor(title: string,
                options: SurveyOption[],
                public date: Date,
                public isLocked: boolean,
                public surveyId: string,
                public adminPwd?: string) {

        super(title, options, isLocked);

    }

    public toJSON() {
        return {
            adminPwd: this.adminPwd,
            date: this.date,
            isLocked: this.isLocked,
            options: this.options.map((option) => option.toJSON()),
            surveyId: this.surveyId,
            title: this.title,
        };
    }
}
