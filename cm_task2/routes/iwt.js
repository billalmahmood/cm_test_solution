var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var titles = [];
	var address = [];

	if("address" in req.query) {
		address = req.query.address;
		// "address" could be string or array so better to convert string to Array
		if(typeof address === 'string') {
			address = [address];
		}

		async.eachSeries(address, function (url, callback) {
			var urlArr = url.split("://");

			if(urlArr[0]!='http' && urlArr[0]!='https') {
				url = 'http://' + url;
			}
			
			request(url, function(error, response, body) {
				
					if(!error && response.statusCode==200) {
						var bodyHtml = cheerio.load(body);

						titles.push( url + " - \"" + bodyHtml('html head title').first().text() + "\"" );
					} else {
						titles.push( url + " - NO RESPONSE");
					}

					callback(); // MUST-called function 
				});
			//eachSeries iterator ends here
		}, function (err) {
			res.render("iwt", {titles: titles});
		});

	}
	
});

module.exports = router;
