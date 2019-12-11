/**
 * Slack関連.
 * 
 * usage:
 *   var slack = require('./slack.js');
 *   slack.write("hoge");
 */

var request = require('request');  

var url = 'https://hooks.slack.com/services/XXXXXXX/XXXXXXXX/XXXXXXXXXXXXXXXXXXXX'; // <- Slack?hooks ID!!!!!!!!!!

var __write = function (msg) {
	
	msg = msg.replace(/"/g, '`');
	var options = {
			url: url,
			form: 'payload={"text": "'+ msg +'" , "unfurl_links": true }',
			json :true
	};
	
	request.post(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
//			console.log(body.name);
		} else if (response.statusCode == 400) {
			console.log('error: '+ response.statusCode + ' -> '+ msg);
		} else {
			console.log('error: '+ response.statusCode + body);
		}
	});
}

exports.write = function (msg) {
	__write(msg);
}
