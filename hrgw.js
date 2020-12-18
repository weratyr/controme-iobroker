const urlHRGW = "<url>/json/v1/"

const request = require('request');
const object_state_name_prefix = 'Controme.hrgw.'


function controme_fetch_differentialcontrols() {
        request(urlHRGW+'differentialcontrols/', function(error,response, body) {
            if(error) log('Fehler request: ' + error, 'error');
            else {
                var data = JSON.parse(body);
                for(var index in data) {
                    var elementIndex = (parseInt(index, 10)+1);
                    var entry = data[index][''+elementIndex];
                    createState(object_state_name_prefix+'dr.'+index+'.output_id', 0, {type: "number", unit: ''});
                    createState(object_state_name_prefix+'dr.'+index+'.description', 0, {type: "string", unit: ''});
                    createState(object_state_name_prefix+'dr.'+index+'.position', 0, {type: "number", unit: '%'});

                    setState(object_state_name_prefix+'dr.'+index+'.description',entry.description, true);
                    setState(object_state_name_prefix+'dr.'+index+'.output_id',entry.output_id, true);
                    setState(object_state_name_prefix+'dr.'+index+'.position',entry.position, true);
                }
            }
        });
}

function controme_fetch_otherouts() {
        request(urlHRGW+'otherouts/', function(error,response, body) {
            if(error) log('Fehler request: ' + error, 'error');
            else {
                var data = JSON.parse(body);
                for(var elements in data) {
                    for(var relais in data[elements]) {
                    createState(object_state_name_prefix+'otherouts.'+elements+'.'+relais, 0, {type: "number", unit: ''});
                    setState(object_state_name_prefix+'otherouts.'+elements+'.'+relais,data[elements][relais], true);
                    }
                }
            }
        });
}

function main() {
    controme_fetch_otherouts();
    controme_fetch_differentialcontrols();
}

main();
main();
schedule('*/10 * * * *', main); // every x minutes