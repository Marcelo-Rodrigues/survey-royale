
import { SurveyRoyaleServer } from './src/SurveyRoyaleServer';

const FRONT_PATH = '../../client';
const FRONT_DEV_URL = 'http://localhost:4200';
const DEVELOPMENT_MODE = (process.env.NODE_ENV === 'development');

const surveyRoyaleServer: SurveyRoyaleServer =
  new SurveyRoyaleServer(FRONT_PATH, DEVELOPMENT_MODE, FRONT_DEV_URL);

surveyRoyaleServer.startServer();
