const express = require('express');
const bodyParser = require('body-parser');
// const fs = require('fs');
const path = require('path');
const app = express();
const http = require('http').Server(app);
// const Datastore = require('nedb');
const io = require('socket.io')(http);

// const db = new Datastore({ filename: path.resolve("surveys.db"), autoload: true });

const surveyRooms = {};

app.use(bodyParser.json());

 app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:4200");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Credentials", "true");
   next();
 });

const FRONT_PATH = "../dist";

app.set('port', (process.env.PORT || 8090));
app.use(express.static(path.resolve(FRONT_PATH)));


app.post('/api/survey', function (req, res) {

  const surveyRoomOptions = req.body;
  const surveyRoom = createRoom(surveyRoomOptions);
  res.send(surveyRoom);
  // db.insert(survey, function (err, doc) {
  //   // delete resultado.adminPwd;
  //   res.send(doc);
  // });

});

app.get('/api/survey/:id', function (req, res) {
  const surveyId = req.params.id;
  const room = surveyRooms[surveyId];

  if(room) {
    res.send(getPublicSurveyInfo(room));

  } else {
    res.send();
  }

  // db.findOne({"_id":surveyId}, function (err, doc) {

  //   if(doc) {
  //     doc.surveyId = doc._id;
  //     delete doc.adminPwd;
  //     delete doc._id;
  //     res.send(doc);
  //   } else {
  //     res.send();
  //   }
  // });
});

app.get('/api/dump', function (req, res) {
    res.send(surveyRooms);
});

function getPublicSurveyInfo(room) {
  return {
    surveyId: room.surveyId,
    title: room.title,
    date: room.date,
    options: room.options
  };
};

function generateGUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  socket.on('enterSurvey', function(surveyConnectionInfo) {
    const room = surveyRooms[surveyConnectionInfo.surveyId];

    if(room) {
      addParticipant(room, socket, surveyConnectionInfo);
      console.log('enteredSurvey');
      socket.emit('surveyInfo', getPublicSurveyInfo(room));
    } else {
      socket.emit('error',{message:'Survey não encontrado'});
    }
  });

  socket.on('adminSurvey', function(surveyConnectionInfo) {
    const room = surveyRooms[surveyConnectionInfo.surveyId];

    if(room) {
      if(isValidAdmin(room, surveyConnectionInfo.adminPwd)) {
        addAdmin(room, socket, surveyConnectionInfo);
        console.log('entered admin Survey');
      } else {
        socket.emit('error',{message:'Senha de admin inválida'});
      }
    } else {
      socket.emit('error',{message:'Survey não encontrado'});
    }
  });

  socket.on('newQuestion', function(surveyConnectionInfo) {
    const room = surveyRooms[surveyConnectionInfo.surveyId];

    if(room) {
      if(isValidAdmin(room, surveyConnectionInfo.adminPwd)) {
        addAdmin(room, socket, surveyConnectionInfo);
        console.log('Nova votação');
      } else {
        socket.emit('error',{message:'Senha de admin inválida'});
      }
    } else {
      socket.emit('error',{message:'Survey '+surveyConnectionInfo.surveyId+' não encontrado'});
    }
  });

  socket.on('answer', function(answer){
    const room = surveyRooms[answer.surveyId];
    if(!room) {
      socket.emit('error',{message:'Survey não encontrado'});
    } else {
      doAnswer(socket.id, room, answer.answer);
    }
  });

  socket.on('disconnect', function(){
    deleteUser(socket.id);
    console.log('user disconnected '+socket.id);
  });

  socket.on('error', function(err){
    console.error(err);

  });
});

function deleteUser(id) {
  Object.values(surveyRooms).forEach(function (room) {
    deleteAdmin(room, id);
    deleteParticipant(room, id);
  });
}

function deleteUserFromRoom(room, target, id, event) {
  const user = target[id];
  if(user) {
    const userName = user.title;
    delete target[id];

    notifyAdmins(room, event, adminName);
  }
}

function deleteAdmin(room, adminId) {
  deleteUserFromRoom(room, room.admins, adminId, 'adminDisconnected');
}

function deleteParticipant(room, participantId) {
  deleteUserFromRoom(room, room.participants, participantId, 'participantDisconnected');
}

function createRoom(configRoom) {
  const room = {
    surveyId: generateGUID(),
    title: configRoom.title,
    date: Date.now(),
    participants: {},
    admins: {},
    answers: {},
    adminPwd: generateGUID(),
    options: configRoom.options
  };

  surveyRooms[room.surveyId] = room;
  console.log('room '+room.surveyId+' created');
  return room;
}

function doAnswer(participantId, room, answer) {
  room.answers[participantId] = {
    date: Date.now(),
    answer: answer
  };

  const answerMessage = {
    answers: room.answers,
    pendingParticipants: getPublicParticipantInformation(getPendingParticipants(room))
  };

  notifyAdmins(room, 'answer', answerMessage);
}

function getPublicParticipantInformation(participants) {
  return participants.map(function(participant){
    return {
      id: participant.socket.id,
      name: participant.socket.id
    };
  })
}

function getPendingParticipants(room) {
  const pendingParticipants = [];
  Object.keys(room.participants).forEach(function(participantId){
    if(!answers[participantId]) {
      pendingParticipants.push(room.participants[participantId]);
    }
  });
  return pendingParticipants;
}

function notifyAdmins(room, event, data) {
  notifyRoom(room.admins, event, data);
}

function notifyParticipants(room, event, data) {
  notifyRoom(room.participants, event, data);
}

function notifyRoom(target, event, data) {
  Object.values(target).forEach(function(admin) {
      if(admin.socket) {
        admin.socket.emit(event, data);
      }
    });
}

function addAdmin(room, socket, surveyConnectionInfo) {
  room.admins[socket.id] = {
    socket: socket,
    name: surveyConnectionInfo.name
  };
}

function addParticipant(room, socket, surveyConnectionInfo) {
  room.participants[socket.id] = {
    socket: socket,
    name: surveyConnectionInfo.name
  };
}

function isValidAdmin(room, adminPwd) {
  return room.adminPwd === adminPwd;
}

app.get('*', function (req, res) {
  res.sendFile(path.resolve(FRONT_PATH,'index.html'));
});

http.listen(app.get('port'), function () {
  console.log('Survey Royale Server iniciado na porta ', app.get('port'));
  console.log(`http://localhost:${app.get('port')}/`);
});
