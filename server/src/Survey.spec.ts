import 'jasmine';
import { SurveyOption } from '../shared/SurveyOption';
import { Survey } from './Survey';

describe('A suite is just a function', () => {
  let a;

  it('and so is a spec', () => {
    a = true;

    expect(a).toBe(true);
  });
});

describe('A Survey', () => {
  let surveyOptions: SurveyOption[];
  let survey: Survey;
  let surveyTitle: string;

  beforeEach(() => {
    surveyOptions = [
      new SurveyOption('Test Opt 1'),
      new SurveyOption('Test Opt 2'),
    ];
    surveyTitle = 'SurveyTest';
    survey = new Survey(surveyTitle, surveyOptions);
  });

  it('has correct answer options', () => {
    expect(survey.options).toBe(surveyOptions);
  });

  it('has correct title', () => {
    expect(survey.title).toBe(surveyTitle);
  });

  // it('has correct title', () => {
  //   let socket: SocketIO.Socket = {

  //   };
  //   let admin = new Client(socket);
  //   survey.addAdmin(admin);
  //   spyOn(survey, '').and.returnValue(true);
  // });
});
