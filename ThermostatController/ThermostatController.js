// Scott Camarena
// scprojects.org
//
//
//Copyright 2016 Scott Camarena
//
//This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//
// 
//
//============================================================

//var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var JSONSender = require('./JSONSender.js');

var ThermostatController = express();
ThermostatController.use(bodyParser.json());

const UPDATE_INTERVAL = 10000;
const MODE_CHANGE_DELAY = 10000;

// =========== CLASSES ===============

var RelayMode = {
	off: "off",
	cool: "cool",
	heat: "heat"
}
var Hardware = function(){
	this.currentTemp = 74.2;
	this.relayMode = RelayMode.off;
}
// Check actual temp
Hardware.prototype.getCurrentTemp = function() {
	return this.currentTemp;
}
Hardware.prototype.getRelayMode = function() {
	return this.relayMode;
}
Hardware.prototype.setRelayMode = function(mode) {
	// TODO: Some validation
	this.relayMode = mode;
}

// ============== INITIALIZATION ===============

var hardware = new Hardware();

// Load defaults
var settings = {
	"minTemp": 60,
	"maxTemp": 90,
	"acEnabled": true,
	"heaterEnabled":true
}
hardware.setRelayMode(RelayMode.off);

//=============== MAIN ===============

function getStatus() {
	return {
		"hwMode": hardware.getRelayMode(),
		"currentTemp": hardware.getCurrentTemp(),
		"settings": settings
	}
}

function tempIsTooLow() {
	return hardware.getCurrentTemp() < settings.minTemp;
}
function tempIsTooHigh() {
	return hardware.getCurrentTemp() > settings.maxTemp;
}

function update() {
	var hwMode = hardware.getRelayMode();
	console.log( "\n" + new Date().toLocaleString()
			+ "\nTemp: " + hardware.getCurrentTemp());

	// Heater Mode
	if(tempIsTooLow() && settings.heaterEnabled) {
		if(hwMode != RelayMode.heat) {
			console.log("Too cold. Turning on AC.");
			hardware.setRelayMode(RelayMode.heat);
		} else {
			console.log("Still too cold.");
		}

	// AC Mode
	} else if(tempIsTooHigh() && thermoMode.acEnabled) {
		if(hwMode != RelayMode.cool) {
			console.log("Too hot. Turning on heater.");
			hardware.setRelayMode(RelayMode.cool);
		} else {
			console.log("Still too hot.");
		}

	// Off
	} else {
		if(hwMode != RelayMode.off) {
			console.log("Perfect! Turning off.");
			hardware.setRelayMode(RelayMode.off);
		} else {
			console.log("Still perfect."
					+ "\nMode: " + hardware.getRelayMode()
					+ "\nMinTemp: " + settings.minTemp
					+ "\nMaxTemp: " + settings.maxTemp);
		}
	}

}

setInterval(update, UPDATE_INTERVAL);

// ============== ENDPOINTS ==================
ThermostatController.get('/getCurrentTemp', function( req, res ){
	res.end("Temp is: " + hardware.getCurrentTemp());
});

ThermostatController.get('/getStatus', function( req, res ){
	//res.end("Hardware Mode: " + hardware.getRelayMode());
	JSONSender.respondJSON(res, getStatus());
});

ThermostatController.post('/setTemp', function( req, res ){
	// TODO: Some validation
	var mode = req.body.mode;
	var temp = req.body.temp;

	if(mode == RelayMode.cool) {
		settings.maxTemp = temp;
		res.end("success");
		return;
	} else if(mode == RelayMode.heat) {
		settings.minTemp = temp;
		res.end("success");
		return;
	}

	res.end("error");
});

var portToListen = process.argv[2];
if(portToListen == null) {
	console.log('Must pass port to listen on.');
	return
}
ThermostatController.listen(portToListen, "0.0.0.0");
console.log('ThermostatController listening on ' + portToListen);
console.log('Status: ' + JSON.stringify(getStatus(), null, "\t") );
exports = module.exports = ThermostatController;
