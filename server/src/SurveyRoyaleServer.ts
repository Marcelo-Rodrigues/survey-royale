import express from 'express';

import bodyParser from 'body-parser';
import path from 'path';
import { inspect } from 'util';
import { LockedSurveyState } from '../shared/LockedSurveyState';
import { MessageControl } from '../shared/MessageControl';
import { PublicAnswerInfo } from '../shared/PublicAnswerInfo';
import { PublicSurveyInfo } from '../shared/PublicSurveyInfo';
import { SurveyAnswer } from '../shared/SurveyAnswer';
import { SurveyConnectionInfo } from '../shared/SurveyConnectionInfo';
import { Client } from './Client';
import { Survey } from './Survey';
import { Utils } from './Utils';

export class SurveyRoyaleServer {

  private readonly colors = require('colors');
  private readonly app = express();
  private readonly http = require('http').Server(this.app);
  private readonly socketIoServer = require('socket.io')(this.http);

  private readonly surveyServerControl: { [key: string]: Survey} = {};

  constructor(frontPath: string,
              developmentMode: boolean = false,
              frontDevUrl: string = 'http://localhost:4200') {

    this.colors.setTheme({
      error: 'red',
      event: ['black', 'bgGreen'],
      eventRed: ['black', 'bgRed'],
      link: 'blue',
      time: ['black', 'bgWhite'],
    });

    this.setupHttpRoutes(frontPath, developmentMode);
    this.setupSocketRoutes(frontPath, developmentMode);
    this.setupDefaultRoute(frontPath, developmentMode, frontDevUrl);

  }

  public createSurvey(survey: PublicSurveyInfo) {
    const createdSurvey = new Survey(survey.title, survey.options);
    this.surveyServerControl[createdSurvey.surveyId] = createdSurvey;
    return createdSurvey;
  }

  public getSurvey(socket: SocketIO.Socket, surveyId: string, callback: (survey: Survey) => any|void) {
      const survey = this.surveyServerControl[surveyId];

      if (survey) {
        callback(survey);
      } else {
        socket.emit('error', MessageControl.ServerErrorDescription.SURVEY_NOT_FOUND_ERR(surveyId));
      }
  }

  public getSurveyAdmin(socket: SocketIO.Socket, surveyId: string, adminPwd: string,
                        callback: (survey: Survey) => any | void) {
    this.getSurvey(socket, surveyId,
      (survey) => {
        if (survey.isValidAdmin(adminPwd)) {
          callback(survey);
        } else {
          socket.emit('error', MessageControl.ServerErrorDescription.ADMIN_INVALID_PWD());
        }
      });
  }

  public deleteUser(userId: string) {
    Utils.getObjectValues<Survey>(this.surveyServerControl)
    .forEach((survey) => survey.removeAll(userId));
  }

  public startServer() {
    this.http.listen(this.app.get('port'), () => {
      this.notificarEventoConsole('Survey Royale Server iniciado na porta', this.app.get('port') + ':',
        this.colors.link(`http://localhost:${this.app.get('port')}/`));
    });
  }

  private notificarEventoConsole(... evento: any[]) {
    console.log(this.colors.time('[' + new Date().toISOString() + ']'), ... evento);
  }

  private setupHttpRoutes(frontPath: string, developmentMode: boolean = false) {

    this.app.use(bodyParser.json());

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });

    this.app.set('port', process.env.PORT || 8090);

    if (!developmentMode) {
      this.app.use(express.static(path.resolve(frontPath)));
    }

    this.app.post('/api/survey', (req, res) => {
      const survey: PublicSurveyInfo = req.body;
      res.send(this.createSurvey(survey).getAdminPublicSurveyInfo().toJSON());
      if (developmentMode) {
        this.notificarEventoConsole(this.colors.event('[post]'), '/api/survey:', survey);
      }
    });

    this.app.get('/api/survey/:id', (req, res) => {
      const surveyId = req.params.id;
      const survey = this.surveyServerControl[surveyId];

      if (survey) {
        res.send(survey.getPublicSurveyInfo().toJSON());
      } else {
        res.send();
      }
      if (developmentMode) {
        this.notificarEventoConsole(this.colors.green('[get]'), '/api/survey/' + surveyId);
      }
    });

    if (developmentMode) {
      this.app.get('/api/dump', (req, res) => {
        res.send(inspect(this.surveyServerControl));
      });
    }
  }

  private setupSocketRoutes(frontPath: string, developmentMode: boolean = false) {
    this.socketIoServer.on('connection', (socket: SocketIO.Socket) => {
      if (developmentMode) {
        this.notificarEventoConsole('user', socket.id, this.colors.event('connected'));
      }

      socket.on(MessageControl.ClientMessages.ENTER_SURVEY_EVENT, (surveyConnectionInfo: SurveyConnectionInfo) => {
        if (developmentMode) {
          this.notificarEventoConsole(MessageControl.ClientMessages.ENTER_SURVEY_EVENT, surveyConnectionInfo) ;
        }
        this.getSurvey(socket, surveyConnectionInfo.surveyId,
              (survey) => {
                if (developmentMode) {
                  console.log(survey) ;
                }
                survey.addParticipant(new Client(socket, surveyConnectionInfo.participantName));
                const response = survey.getPublicSurveyInfo().toJSON();
                if (developmentMode) {
                  console.log(MessageControl.ServerMessages.SURVEY_INFO_EVENT, response) ;
                }
                socket.emit(MessageControl.ServerMessages.SURVEY_INFO_EVENT, response);
            });
        });

      socket.on(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT,
        (surveyConnectionInfo: SurveyConnectionInfo) => {
        if (developmentMode) {
          this.notificarEventoConsole(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT,
            socket.id, surveyConnectionInfo.surveyId, surveyConnectionInfo.adminPwd as string) ;
        }
        this.getSurveyAdmin(socket, surveyConnectionInfo.surveyId, surveyConnectionInfo.adminPwd as string,
          (survey) => {
            if (developmentMode) {
              this.notificarEventoConsole(MessageControl.ClientMessages.ADMINISTRATE_SURVEY_EVENT,
                socket.id) ;
            }
            survey.addAdmin(new Client(socket));
          });
      });

      socket.on(MessageControl.ClientMessages.NEW_QUESTION_EVENT,
        (surveyConnectionInfo: SurveyConnectionInfo) => {
        this.getSurveyAdmin(socket, surveyConnectionInfo.surveyId,
          surveyConnectionInfo.adminPwd as string,
          (survey) => {
            if (developmentMode) {
              this.notificarEventoConsole(MessageControl.ClientMessages.NEW_QUESTION_EVENT, socket.id) ;
            }
            survey.resetAnswers();
          });
      });

      socket.on(MessageControl.ClientMessages.ANSWER_EVENT, (answer: SurveyAnswer) => {
        this.getSurvey(socket, answer.surveyId,
          (survey) => {
            if (developmentMode) {
              this.notificarEventoConsole(this.colors.green(MessageControl.ClientMessages.ANSWER_EVENT),
               socket.id, answer, new PublicAnswerInfo(answer.surveyId, socket.id, answer.option)) ;
            }
            survey.answer(new PublicAnswerInfo(answer.surveyId, socket.id, answer.option));

          });
      });

      socket.on(MessageControl.ClientMessages.DISCONNECT_EVENT, () => {
        if (developmentMode) {
          this.notificarEventoConsole('user', socket.id, this.colors.eventRed('disconnected'));
        }
        this.deleteUser(socket.id);
      });

      socket.on(MessageControl.ClientMessages.LOCK_SURVEY_EVENT, (lockedState: LockedSurveyState) => {
        this.getSurveyAdmin(socket, lockedState.surveyId, lockedState.adminPwd as string,
          (survey) => {
            if (developmentMode) {
              this.notificarEventoConsole(MessageControl.ClientMessages.LOCK_SURVEY_EVENT,
                 lockedState.locked, socket.id);
            }
            survey.setLockSurveyState(lockedState);
          });
        if (developmentMode) {
          this.notificarEventoConsole('user', socket.id, this.colors.eventRed('disconnected'));
        }
        this.deleteUser(socket.id);
      });

      socket.on('error', (err: Error) => {
        this.notificarEventoConsole(this.colors.bgRed('Falha:'), this.colors.red(err));
      });
    });
  }

  private setupDefaultRoute(frontPath: string, developmentMode: boolean, frontDevUrl: string) {
    if (developmentMode) {
      console.log(this.colors.yellow('Modo de desenvolvimento - redirecionando o front para ') +
      this.colors.link(frontDevUrl));

      this.app.get('*', (req, res) => {
        res.redirect(frontDevUrl);
      });
    } else {
      this.app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontPath, 'index.html'));
      });
    }
  }
}
