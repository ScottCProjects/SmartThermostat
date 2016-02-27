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
// Generic JSON Sender Utility
//
//============================================================

var http = require('http');
var latinizer = require('./latinizer.js');

var JSONSender = function(){}

JSONSender.postJSON = function( hostInfo, dataObj ){
	try{
		var data = latinizer.latinize(JSON.stringify(dataObj))
		var options = {
			host: hostInfo.HOST,
			port: hostInfo.PORT,
			path: hostInfo.PATH,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length 
			}
		};

		var req = http.get( options, function(res){
				res.setEncoding('utf8');
				res.on('data', function(postResponse){
						console.log( "Post Response: " + postResponse );
				});
		});
		
		req.write(data);
		req.end();
	} catch(ex){
		console.log("Exception caught in JSONSender: " + ex.message);
	}
}

JSONSender.respondJSON = function(response, jsonObj) {
	try{
		var data = latinizer.latinize(JSON.stringify(jsonObj));
		var headers = {
			'Content-Type': 'application/json',
			'Content-Length': data.length 
		}
		
		response.writeHead(200, headers);
		response.end(data);
	} catch(ex){
		console.log("Exception caught in JSONSender: " + ex.message);
	}
}

module.exports = JSONSender;
