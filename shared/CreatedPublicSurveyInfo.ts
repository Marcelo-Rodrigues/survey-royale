import { PublicSurveyInfo } from './PublicSurveyInfo';
import { SurveyOption } from './SurveyOption';
import { Serializable } from './Serializable'

export class CreatedPublicSurveyInfo extends PublicSurveyInfo implements Serializable {
    constructor(title: string,
        options: SurveyOption[],
        public date: Date,
        public surveyId: string,
        public adminPwd?: string) {
            
        super(title, options);
        
    }
    
    serialize() {
        return {
            options: this.options.map(option => option.serialize()),
            date: this.date,
            surveyId: this.surveyId,
            adminPwd: this.adminPwd,
            title: this.title
        };
    }
}
