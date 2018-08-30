import express from 'express';

import bodyParser from 'body-parser';
import path from 'path';
import { Survey } from './Survey';
import { SurveyConnectionInfo } from '../../shared/SurveyConnectionInfo';
import { Client } from './Client';
import { MessageControl } from '../../shared/MessageControl';
import { Utils } from './Utils';
import { PublicSurveyInfo } from '../../shared/PublicSurveyInfo';
import { PublicAnswerInfo } from '../../shared/PublicAnswerInfo';
import { SurveyAnswer } from '../../shared/SurveyAnswer';
import { inspect } from 'util'

const app = express();
const http = require('http').Server(app);
const socketIoServer = require('socket.io')(http);

const surveyServerControl: { [key: string]: Survey} = {};

const VERBOSE_MODE = true;

const FRONT_PATH = '../client';

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.set('port', process.env.PORT || 8090);
app.use(express.static(path.resolve(FRONT_PATH)));

app.post('/api/survey', (req, res) => {
  const survey: PublicSurveyInfo = req.body;
  res.send(createSurvey(survey).getAdminPublicSurveyInfo().serialize());
  if(VERBOSE_MODE) {
    console.log('[post] /api/survey:', survey);
  }
});

app.get('/api/survey/:id', function(req, res) {
  const surveyId = req.params.id;
  const survey = surveyServerControl[surveyId];

  if (survey) {
    res.send(survey.getPublicSurveyInfo().serialize());
  } else {
    res.send();
  }
  if(VERBOSE_MODE) {
    console.log('[get] /api/survey/' + surveyId);
  }
});

if(VERBOSE_MODE) {
  app.get('/api/dump', function(req, res) {
    res.send(inspect(surveyServerControl));
  });
}

function createSurvey(survey: PublicSurveyInfo) {
  const createdSurvey = new Survey(survey.title, survey.options);
  surveyServerControl[createdSurvey.surveyId] = createdSurvey;
  return createdSurvey;
}

function getSurvey(socket: SocketIO.Socket, surveyId: string, callback: (survey: Survey) => any|void) {
    const survey = surveyServerControl[surveyId];

    if (survey) {
      callback(survey);
    } else {
      socket.emit('error', MessageControl.ServerErrorDescription.SURVEY_NOT_FOUND_ERR(surveyId));
    }
}

function getSurveyAdmin(socket: SocketIO.Socket, surveyId: string, adminPwd: string, callback: (survey: Survey) => any|void) {
  getSurvey(socket, surveyId,
    (survey) => {
      if (survey.isValidAdmin(adminPwd)) {
        callback(survey);
      } else {
        socket.emit('error', MessageControl.ServerErrorDescription.ADMIN_INVALID_PWD());
      }
    });
}

socketIoServer.on('connection', (socket: SocketIO.Socket) => {
  if(VERBOSE_MODE) {
    console.log('user connected', socket.id);
  }

  socket.on(MessageControl.ClientMessages.ENTER_SURVEY_EVENT, (surveyConnectionInfo: SurveyConnectionInfo) => {
    if(VERBOSE_MODE) {
      console.log(MessageControl.ClientMessages.ENTER_SURVEY_EVENT, surveyConnectionInfo) ;
    }
        getSurvey(socket, surveyConnectionInfo.surveyId,
          (survey) => {
            if(VERBOSE_MODE) {
              console.log(survey) ;
            }
            survey.addParticipant(new Client(socket, surveyConnectionInfo.participantName));
            const response = survey.getPublicSurveyInfo().serialize();
            if(VERBOSE_MODE) {
              console.log(MessageControl.ServerMessages.SURVEY_INFO_EVENT, response) ;
            }
            socket.emit(MessageControl.ServerMessages.SURVEY_INFO_EVENT, response);
        });
    });

  socket.on(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT, (surveyConnectionInfo: SurveyConnectionInfo) => {
    if(VERBOSE_MODE) {
      console.log(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT, socket.id, surveyConnectionInfo.surveyId, <string>surveyConnectionInfo.adminPwd) ;
    }
    getSurveyAdmin(socket, surveyConnectionInfo.surveyId, <string>surveyConnectionInfo.adminPwd,
      (survey) => {
        if(VERBOSE_MODE) {
          console.log(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT, socket.id) ;
        }
        survey.addAdmin(new Client(socket));
      }
    );
  });

  socket.on(MessageControl.ClientMessages.NEW_QUESTION_EVENT, (surveyConnectionInfo: SurveyConnectionInfo) => {
    getSurveyAdmin(socket, surveyConnectionInfo.surveyId, <string>surveyConnectionInfo.adminPwd,
      (survey) => {
        if(VERBOSE_MODE) {
          console.log(MessageControl.ClientMessages.NEW_QUESTION_EVENT, socket.id) ;
        }
        survey.resetAnswers();
      }
    );
  });

  socket.on(MessageControl.ClientMessages.ANSWER_EVENT, (answer: SurveyAnswer) => {
    getSurvey(socket, answer.surveyId,
      (survey) => {
        if(VERBOSE_MODE) {
          console.log(MessageControl.ClientMessages.ANSWER_EVENT, socket.id, answer, new PublicAnswerInfo(answer.surveyId, socket.id, answer.option)) ;
        }
        survey.answer(new PublicAnswerInfo(answer.surveyId, socket.id, answer.option));

      });
  });

  socket.on(MessageControl.ClientMessages.DISCONNECT_EVENT, function() {
    if(VERBOSE_MODE) {
      console.log(MessageControl.ClientMessages.DISCONNECT_EVENT, socket.id);
    }
    deleteUser(socket.id);
  });

  socket.on('error', (err: Error) => {
    console.error(err);
  });
});

function deleteUser(userId: string) {
  Utils.getObjectValues<Survey>(surveyServerControl)
  .forEach((survey) => survey.removeAll(userId));
}

app.get('*', (req, res) => {
  res.sendFile(path.resolve(FRONT_PATH, 'index.html'));
});

http.listen(app.get('port'), () => {
  console.log('Survey Royale Server iniciado na porta ', app.get('port'));
  console.log(`http://localhost:${app.get('port')}/`);
});
