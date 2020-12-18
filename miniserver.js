
const ms_url = '<url>/get/json/v1/2/temps/';

// room dict key = room number , value
const roomsDict = {1: 'kitchen', 2: 'livingroom', 3: 'bathroom'};


const request = require('request');
const object_state_name_prefix = 'Controme.ms.'

function check_value(value) {
    if(value !== null && value !== '' && typeof value !== 'undefined')
        return true;
    else return false;
}

function controme_fetchMS() {
    for(var key in roomsDict) {
        request(ms_url+key, function(error,response, body) {
            if(error) log('Fehler request: ' + error, 'error');

            else {
                var sensoren = JSON.parse(body)[0].sensoren;
                var room = JSON.parse(body)[0];
                var roomName = room.name.trim();

                createState(object_state_name_prefix+roomName+'.solltemperatur', 0, {type: "number", unit: '°C'});
                createState(object_state_name_prefix+roomName+'.temperatur', 0, {type: "number", unit: '°C'});
                createState(object_state_name_prefix+roomName+'.name', 0, {type: "string", unit: ''});
                createState(object_state_name_prefix+roomName+'.luftfeuchte', 0, {type: "number", unit: '%'});
                createState(object_state_name_prefix+roomName+'.id', 0, {type: "number", unit: ''});
                if (existsState(object_state_name_prefix+roomName+'.solltemperatur')) { // catch first run
                    setState(object_state_name_prefix+roomName+'.solltemperatur', room.solltemperatur, true);
                    setState(object_state_name_prefix+roomName+'.temperatur', room.temperatur, true);
                    setState(object_state_name_prefix+roomName+'.id', room.id, true);
                    setState(object_state_name_prefix+roomName+'.name', room.name, true);

                    if(room.luftfeuchte !== null && room.luftfeuchte !== '') {
                        setState(object_state_name_prefix+roomName+'.luftfeuchte', Math.round(10*room.luftfeuchte)/10, true);
                    }
                } else
                    console.log('does not exist - catch first run'+ roomName);

                var sensoren = JSON.parse(body)[0].sensoren;
                var sensorCount = 0;
                for(var sensor in sensoren) {
                    createState(object_state_name_prefix+roomName+'.'+sensorCount+'.raumtemperatursensor',  {type: "boolean", unit: ''});
                    createState(object_state_name_prefix+roomName+'.'+sensorCount+'.wert', 0, {type: "number", unit: '°C'});
                    createState(object_state_name_prefix+roomName+'.'+sensorCount+'.letzte_uebertragung', 0, {type: "string", unit: ''});
                    createState(object_state_name_prefix+roomName+'.'+sensorCount+'.name', 0, {type: "string", unit: ''});
                    createState(object_state_name_prefix+roomName+'.'+sensorCount+'.beschreibung', 0, {type: "string", unit: ''});

                    if (existsState(object_state_name_prefix+roomName+'.solltemperatur')) { // catch first run
                        if(check_value(sensoren[sensor].raumtemperatursensor)) {
                            setState(object_state_name_prefix+roomName+'.'+sensorCount+'.raumtemperatursensor',sensoren[sensor].raumtemperatursensor, true);
                        }
                        if(check_value(sensoren[sensor].wert)) {
                            setState(object_state_name_prefix+roomName+'.'+sensorCount+'.wert', sensoren[sensor].wert, true);
                        }
                        setState(object_state_name_prefix+roomName+'.'+sensorCount+'.letzte_uebertragung', ''+sensoren[sensor].letzte_uebertragung, true);
                        setState(object_state_name_prefix+roomName+'.'+sensorCount+'.name', sensoren[sensor].name, true);
                        if(check_value(sensoren[sensor].beschreibung)) {
                            setState(object_state_name_prefix+roomName+'.'+sensorCount+'.beschreibung', sensoren[sensor].beschreibung, true);
                        }
                    } else
                        log('does not exist - catch first run');
                    sensorCount=(sensorCount+1);
                }
            }
        });
    }
}


controme_fetchMS();
controme_fetchMS();
schedule('*/5 * * * *', controme_fetchMS); // every x minutes
