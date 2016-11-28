var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var rsvp = require('rsvp');
var router = express.Router();

var getSiteTitle = function(titles, url) {
	var promise = new rsvp.Promise(function(resolve, reject) {
			
		request(url, function(error, response, body){
			if(!error && response.statusCode==200) {
				var bodyHtml = cheerio.load(body);

				titles.push( url + " - \"" + bodyHtml('html head title').first().text() + "\"" );
			} else {
				titles.push( url + " - NO RESPONSE");
			}

			resolve();
		});

	});

	return promise;
};

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

		var promises = address.map(function(url) {
			var urlArr = url.split("://");

			if(urlArr[0]!='http' && urlArr[0]!='https') {
				url = 'http://' + url;
			}
			
			return getSiteTitle(titles, url);
		});

		rsvp.all(promises).then(function(addressRequests) {
			res.render("iwt", {titles: titles});
		}).catch(function(reason){
		  // if any of the promises fails.
		});
	}
	
});

module.exports = router;
