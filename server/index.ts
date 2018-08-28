import express = require('express');

import bodyParser = require('body-parser');
import path = require('path');
import { Survey } from './Survey';
import { SurveyConnectionInfo } from '../shared/SurveyConnectionInfo';
import { Client } from './Client';
import { MessageControl } from '../shared/MessageControl';
import { Answer } from '../shared/Answer';
import { Utils } from './Utils';

const app = express();
const http = require('http').Server(app);
const socketIoServer = require('socket.io')(http);

const surveyServerControl: { [key: string]: Survey} = {};

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

const FRONT_PATH = '../dist';

app.set('port', process.env.PORT || 8090);
app.use(express.static(path.resolve(FRONT_PATH)));

app.post('/api/survey', (req, res) => {
  const survey: Survey = req.body;
  const surveyRoom = createSurvey(survey);
  res.send(surveyRoom);
});

app.get('/api/survey/:id', function(req, res) {
  const surveyId = req.params.id;
  const survey = surveyServerControl[surveyId];

  if (survey) {
    res.send(survey.getPublicSurveyInfo());
  } else {
    res.send();
  }
});

app.get('/api/dump', function(req, res) {
  res.send(surveyServerControl);
});

function createSurvey(survey: Survey) {
  const createdSurvey = new Survey(survey.title, survey.options);
  surveyServerControl[createdSurvey.surveyId] = createdSurvey;
  return createdSurvey;
}

function getSurvey(socket: SocketIO.Socket, surveyId: string, callback: (survey: Survey) => any|void) {
    const survey = surveyServerControl[surveyId];

    if (survey) {
      callback(survey);
    } else {
      socket.emit('error', MessageControl.ServerErrorDescription.SURVEY_NOT_FOUND_ERR);
    }
}

function getSurveyAdmin(socket: SocketIO.Socket, surveyId: string, adminPwd: string, callback: (survey: Survey) => any|void) {
  getSurvey(socket, surveyId,
    (survey) => {
      if (survey.isValidAdmin(adminPwd)) {
        callback(survey);
      } else {
        socket.emit('error', MessageControl.ServerErrorDescription.ADMIN_INVALID_PWD);
      }
    });
}

socketIoServer.on('connection', (socket: SocketIO.Socket) => {
  console.log('user connected', socket.id);

  socket.on(MessageControl.ClientMessages.ENTER_SURVEY_EVENT, (surveyConnectionInfo: SurveyConnectionInfo) => {
        getSurvey(socket, surveyConnectionInfo.surveyId,
          (survey) => {
            survey.addParticipant(new Client(socket, surveyConnectionInfo.participantName));
            socket.emit(MessageControl.ServerMessages.SURVEY_INFO_EVENT, survey.getPublicSurveyInfo());
        });
    });

  socket.on(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT, (surveyConnectionInfo: SurveyConnectionInfo) => {
    getSurveyAdmin(socket, surveyConnectionInfo.surveyId, <string>surveyConnectionInfo.adminPwd,
      (survey) => survey.addAdmin(new Client(socket))
    );
  });

  socket.on(MessageControl.ClientMessages.NEW_QUESTION_EVENT, (surveyConnectionInfo: SurveyConnectionInfo) => {
    getSurveyAdmin(socket, surveyConnectionInfo.surveyId, <string>surveyConnectionInfo.adminPwd,
      (survey) => survey.resetAnswers()
    );
  });

  socket.on(MessageControl.ClientMessages.ANSWER_EVENT, (answer: Answer) => {
    getSurvey(socket, answer.surveyId,
      (survey) => survey.answer(new Answer(answer.surveyId, socket.id, answer.option)));
  });

  socket.on(MessageControl.ClientMessages.DISCONNECT_EVENT, function() {
    deleteUser(socket.id);
    console.log('user disconnected ' + socket.id);
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
