'use strict'

const Measurement = use('App/Models/Measurement')
const randomString = require('random-string')
const {v4: uuidv4} = require('uuid');
const Ws = use('Ws')
const Database = use('Database')

class MeasurementController {

  async index({request}) {
    // return await Measurement.all()
    // request.input('description')


   const input = await Measurement.query().where('id', '>', `${request.input('id')}`).fetch();
   /*var input = [
     {
       "id": 531,
       "measurementid": "a6d916dc-9d6a-4523-92cd-783b620ca312",
       "waterlevel": 1440,
       "tankid": "1",
       "created_at": "2021-09-24 21:23:22",
       "updated_at": "2021-09-24 21:23:22"
     },
     {
       "id": 532,
       "measurementid": "672b625a-7bed-43d2-8c3a-e360095e1a0a",
       "waterlevel": 1448,
       "tankid": "1",
       "created_at": "2021-09-24 21:23:42",
       "updated_at": "2021-09-24 21:23:42"
     },
     {
       "id": 533,
       "measurementid": "76c1eb3f-8f74-4fd1-b487-38cdcbe55ba7",
       "waterlevel": 1456,
       "tankid": "1",
       "created_at": "2021-09-24 21:24:04",
       "updated_at": "2021-09-24 21:24:04"
     },
     {
       "id": 534,
       "measurementid": "dfd438dd-0721-4ee3-b3b3-8e49053e827c",
       "waterlevel": 1464,
       "tankid": "1",
       "created_at": "2021-09-24 21:24:23",
       "updated_at": "2021-09-24 21:24:23"
     }
   ]*/
   var output = [];
    for(var i = 0; i < input.rows.length; i++) {
      var obj = input.rows[i];
      output.push([obj.created_at, obj.waterlevel]);
    }
    return output;
  }

  async schema({request}) {

    return [{
      "name": "Time",
      "type": "date",
      "format": "%Y-%m-%dT%H:%M:%S.%LZ"
    }, {
      "name": "Water Level in cm",
      "type": "number"
    }];
  }

  async store({request, response, session, auth}) {
    const job = request.all();

    let attributes = {
      measurementid: uuidv4(),
      waterlevel: job.waterlevel,
      tankid: job.tankid
    };
    const posted = Measurement.create(attributes);
    // console.log(`${posted}`)

    let topic = Ws.getChannel(`measurement:*`).topic(`measurement:595f806b-e400-473b-befa-8e82fb0f993a`);
    if (topic) {
      topic.broadcast('message', attributes)
    }

    return 1;
  }

  async latestMeasurement({request}) {
    return await Measurement.query().orderBy('id', 'desc').first()
  }

  chart({view, auth, response, session}) {
    return view.render('chart')
  }
}

module.exports = MeasurementController
