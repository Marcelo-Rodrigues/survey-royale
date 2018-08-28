import { PublicSurveyInfo } from './PublicSurveyInfo';
import { SurveyOption } from './SurveyOption';

export class CreatedPublicSurveyInfo extends PublicSurveyInfo {
    constructor(title: string,
        options: SurveyOption[],
        public date: Date,
        public surveyId: string,
        public adminPwd?: string) {
            
        super(title, options);
        
    }
}
