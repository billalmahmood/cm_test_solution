var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var titles = [];
	var resArrived = 0;
	var address = [];

	if("address" in req.query) {
		address = req.query.address;
		// "address" could be string or array so better to convert string to Array
		if(typeof address === 'string') {
			address = [address];
		}

		for(var i in address) {
			var url = address[i];
			var urlArr = url.split("://");

			if(urlArr[0]!='http' && urlArr[0]!='https') {
				url = 'http://' + url;
			}
			
			request(url, function(url) {
				return function(error, response, body){
				
					if(!error && response.statusCode==200) {
						var bodyHtml = cheerio.load(body);

						titles.push( url + " - \"" + bodyHtml('html head title').first().text() + "\"" );
					} else {
						titles.push( url + " - NO RESPONSE");
					}

					resArrived++;
				};
			}(url) );
		}
	}

	var intervalHandler = setInterval(function(){
		if(resArrived==address.length) {
			clearInterval(intervalHandler);
			res.render("iwt", {titles: titles});
		}
	}, 500);
	
});

module.exports = router;
