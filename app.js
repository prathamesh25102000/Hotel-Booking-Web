const express = require('express')
const bp = require('body-parser')
const https = require('https')
const e = require('express')
const path = require('path')
const { resolvePtr } = require('dns')
const app = express()

app.use(bp.urlencoded({ extended: true }))

app.get('/home.html', function (req, res) {
	res.sendFile(__dirname + '/home.html')
})

app.get('/privacy.html', function (req, res) {
	res.sendFile(__dirname + '/privacy.html')
})

app.get('/t&c.html', function (req, res) {
	res.sendFile(__dirname + '/t&c.html')
})

app.get('/user_agreement.html', function (req, res) {
	res.sendFile(__dirname + '/user_agreement.html')
})

app.get('/searchlocations.html', function (req, res) {
	res.sendFile(__dirname + '/searchlocations.html')
})



app.post('/searchlocations.html', function (req, resp) {
	const name = req.body.name
	const local = req.body.locals
	//console.log(name);
	//console.log(local);
	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/locations?name=" + name + "&locale=" + local,
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.request(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			const a = JSON.parse(body.toString())
			var id = a[0].dest_id
			//console.log(a)

			resp.setHeader("Content-Type", "text/html");

			resp.write("<h3 style=color:red;text-align:center;font-weight:bolder>Destination id for your search is " + id + "</h3>")
			resp.write("<h4 style=color:darkorchid;text-align:center;font-weight:bolder>destination : " + a[0].name + "</h4>")
			resp.write("<h4 style=color:darkorchid;text-align:center;font-weight:bolder>destination type : " + a[0].dest_type + "</h4>")
			resp.write("<h4 style=color:darkorchid;text-align:center;font-weight:bolder>region : " + a[0].region + "</h4>")
			resp.write("<h4 style=color:darkorchid;text-align:center;font-weight:bolder>country : " + a[0].country + "</h4>")
			resp.write("<h4 style=color:darkorchid;text-align:center;font-weight:bolder>timzone : " + a[0].timezone + "</h4>")
			resp.write("<h4 style=color:darkorchid;text-align:center;font-weight:bolder>hotels : " + a[0].hotels + "</h4>")

			resp.write("<h1 style=text-align:center;><img  src=" + a[0].image_url + "></h1>")


		});
	});

	reqt.end();
})



app.get('/searchhotels.html', function (req, res) {
	res.sendFile(__dirname + '/searchhotels.html')
})

app.post('/searchhotels.html', function (req, resp) {

	const unit = req.body.units
	const rn = req.body.rn
	const an = req.body.an
	const co = req.body.co
	const ci = req.body.ci
	const dt = req.body.dt
	const id = req.body.id
	const cr = req.body.cr
	const ob = req.body.ob
	const loc = req.body.loc
	console.log(dt);



	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/search?checkout_date=" + co + "&units=" + unit + "&dest_id=" + id + "&dest_type=" + dt + "&locale=" + loc + "&adults_number=" + an + "&order_by=" + ob + "&filter_by_currency=" + cr + "&checkin_date=" + ci + "&room_number=" + rn,

		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.request(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			const b = JSON.parse(body.toString())
			console.log(b);
			var c = b.result
			var l = c.length

			resp.setHeader("Content-Type", "text/html");
			if (l == 0) {
				resp.write("<h1 style=color:red;>No Matches Found For Your Search</h1>")
			}
			else {
				resp.write("<h4>Showing " + l + " of " + l + " results.</h4>")
				var w = 1
				c.forEach(e => {
					resp.write("<h1 style=color:darkorange;text-align:center;>" + w + "." + e.hotel_name_trans + "</h1>")
					var photourl = e.max_photo_url
					var purl = photourl.replace('1280x900', '600x400')
					resp.write("<h1 style=text-align:center;><img style=max-width:50%;max-height:40% src=" + purl + "></h1>")

					w = w + 1
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal;>hotel id : " + e.hotel_id + "<h4>")
					//resp.write("<h4>class : "+e.class+"<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal;>open from : " + e.checkin.from + " to " + e.checkout.until + "<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal;>distance from city centre : " + e.distance + " km<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal>city: " + e.city_trans + "<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal>address : " + e.address + "<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal>country : " + e.country_trans + "<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal>accomodation type : " + e.accommodation_type_name + "<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal>minimum total price : " + e.min_total_price + "<h4>")
					var bool = " No"
					if (e.is_free_cancellable === 1) {
						bool = " Yes"
					}
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal;>is free cancellable ? " + bool + "<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal>note : " + e.ribbon_text + "<h4>")
					var aval = " Yes"
					if (e.soldout === 1) {
						aval = " No"
					}
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal;>availability : " + aval + "<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal;teal>remark based on reviews : " + e.review_score_word + "<h4>")
					resp.write("<h4 style=text-align:center;font-weight:bolder;color:teal;margin-bottom:120px;>review score : " + e.review_score + " out of 10<h4>")

					//resp.write("<h4>Name: "+e.hotel_name_trans+"<h4>")

				});
				//console.log(c);
			}
		});

	});

	reqt.end();
})

app.get('/map.html', function (req, res) {
	res.sendFile(__dirname + '/map.html')
})

app.post('/map.html', function (req, resp) {
	var hid = req.body.hid
	var l = req.body.loc
	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/map-markers?hotel_id=" + hid + "&locale=" + l,
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.request(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			var d = JSON.parse(body.toString());
			var map = d.map_preview_url
			var lat = d.geo_info.city_centre.latitude
			var lon = d.geo_info.city_centre.longitude
			var dist = d.geo_info.city_centre.distance
			resp.write("<h1 style=text-align:center;color:teal>City centre  " + "</h1>")
			resp.write("<h4 style=text-align:center;color:blue>latitude : " + lat + "</h4>")
			resp.write("<h4 style=text-align:center;color:blue>longitude : " + lon + "</h4>")
			resp.write("<h4 style=text-align:center;color:blue>distance : " + dist + "</h4>")
			resp.write("<h1 style=text-align:center;><img src=" + map + "></h1>")
		});
	});

	reqt.end();
})

app.get('/details.html', function (req, res) {
	res.sendFile(__dirname + '/details.html')
})

app.post('/details.html', function (req, resp) {
	var hid = req.body.hid
	var l = req.body.loc

	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/data?locale=" + l + "&hotel_id=" + hid,
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.request(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			d = JSON.parse(body.toString());
			var q = d.description_translations[0].description
			//imurl = d.entrance_photo_url

		
			resp.write("<h1 style=text-align:center;color:purple>About " + d.name + "</h1>")
			resp.write("<h1 style=text-align:center;width:500px;><h4 style=padding:20px;color:black;background-color:ivory;font-weight:bolder; >" + q + "</h4></h1>")
			//if (imurl === undefined) {
			//resp.write("<h4>Image not available for this hotel.")
			//}
			//else {
			//resp.write("<img src=" + im + ">")
			//resp.write("<img src="+d.main_photo_url+">")
			//}


		});
	});

	reqt.end();
})

app.get('/reviews.html', function (req, res) {
	res.sendFile(__dirname + '/reviews.html')
})

app.post('/reviews.html', function (req, resp) {

	var hid = req.body.hid
	var l = req.body.loc

	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/review-scores?hotel_id=" + hid + "&locale=" + l,
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.request(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			var d = JSON.parse(body.toString());
			//console.log(d)
			var k = d.score_breakdown[0]
			resp.setHeader("Content-Type", "text/html");

			resp.write("<h4 style=margin-left:25px;> hotel id " + hid + "</h4>")
			resp.write("<h2 style=font-weight:bolder;color:coral;text-decoration:underline;margin-left:25px;> Score Breakdown : " + "</h2>")
			resp.write("<h4 style=margin-left:30px;>Showing reviews since : " + k.from_year + "</h4>")

			//k.forEach(e => {
			var l = k.question
			l.forEach(f => {
				resp.write("<ul><li style=font-weight:bold;color:firebrick>" + f.localized_question + "</li></ul>")
				resp.write("<h4 style=margin-left:25px> reviewd by " + f.count + " people</h4>")
				resp.write("<h4 style=margin-left:25px> score " + f.score + "</h4>")

			});

			//})
			resp.write("<h2 style=font-weight:bolder;color:orangered;text-decoration:underline;margin-left:25px;>Score Percentage : </h2>")
			var k = d.score_percentage
			k.forEach(e => {
				resp.write("<ul><li style=font-weight:bold;color:crimson;background-color:yellow;width:150px;>score word : " + e.score_word + "</li></ul>")
				resp.write("<h4 style=margin-left:25px>score range : " + e.score_start + " to " + e.score_end + "</h4>")
				if (e.score_percentage != undefined) {
					resp.write("<h4 style=margin-left:25px> percentage " + e.score_percentage + "</h4>")
				}
				resp.write("<h4 style=margin-left:25px>reviewd by " + e.count + " people</h4>")


			});

		});
	});
	reqt.end();
})

app.get('/facility.html', function (req, res) {
	res.sendFile(__dirname + '/facility.html')
})

app.post('/facility.html', function (req, resp) {
	hid = req.body.hid
	l = req.body.loc
	console.log(hid, l);

	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/facilities?locale=" + l + "&hotel_id=" + hid,
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.get(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			var d = JSON.parse(body.toString());
			var u = "https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/000000/external-outline-effect-tickmark-under-a-square-box-votes-color-tal-revivo.png"
			resp.write("<h1 style=color:mediumvioletred;margin-left:50px;margin-bottom:30px>Facilities provided by hotel</h1>")
			d.forEach(e => {
				resp.write("<div><img style=margin-left:50px src=" + u + "><h4 style=font-size:16px;margin-top:-21px;margin-left:100px>" + e.facility_name + "</h4></div><br></br>")
			});

		});
	});

	reqt.end();
})

app.get('/policy.html', function (req, res) {
	res.sendFile(__dirname + '/policy.html')
})

app.post('/policy.html', function (req, resp) {
	var hid = req.body.hid
	var l = req.body.loc

	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/policies?hotel_id=" + hid + "&locale=" + l,
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.get(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			var d = JSON.parse(body.toString());
			var f = d.policy;
			//var j="hotel"
			resp.write("<h1 style=color:crimson;word-spacing:20px;margin-left:10px>Policies and rules of hotel" + "</h1>")

			f.forEach(e => {
				resp.write("<ul><li style=list-style-type:square;color:purple;font-weight:bold>" + e.content[0].ruleset[0].name + "</li><span></span>" + "<li style=list-style-type:none>" + e.content[0].ruleset[0].rule[0].content + "</li></ul>")
				
			});
			resp.write("<h4 style=margin-left:20px;text-decoration:underline> active since " + d.active_since + "</h4>")
		});
	});

	reqt.end();
})

app.get('/payment.html', function (req, res) {
	res.sendFile(__dirname + '/payment.html')
})

app.post('/payment.html', function (req, resp) {
	var hid = req.body.hid
	var l = req.body.loc


	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/payment-features?hotel_id=" + hid + "&locale=" + l,
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.request(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			var d = JSON.parse(body.toString());
			//console.log(d);
			var f = " no"
			resp.write("<h1 style=color:orchid;margin-left:40px;font-weight:bold>Your Payment Details</h1>")
			resp.write("<h4 style=padding:10px;margin-left:75px;color:red;width:200px;font-weight:bold;background-color:palegoldenrod>CVC required : " + d[0].cvc_required + "</h4>")
			resp.write("<h4 style=padding:10px;margin-left:75px;width:200px;color:red;font-weight:bold;background-color:palegoldenrod > hotel id: " + hid + "</h4 > ")
			resp.write("<h4 style=padding:10px;margin-left:75px;width:200px;color:red;font-weight:bold;background-color:palegoldenrod>bookable : " + d[0].payable + "</h4>")
			if (d[0].is_direct_payment === 1) {
				f = " yes"
			}
			resp.write("<h4 style=padding:10px;margin-left:75px;width:200px;color:red;font-weight:bold;background-color:palegoldenrod>is direct payment? " + f + "</h4>")
			resp.write("<h4 style=padding:10px;margin-left:75px;width:200px;color:red;font-weight:bold;background-color:palegoldenrod>payable : " + d[0].payable + "</h4>")


		});
	});

	reqt.end();
})


app.get('/photo.html', function (req, res) {
	res.sendFile(__dirname + '/photo.html')
})

app.post('/photo.html', function (req, resp) {


	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/photos?hotel_id=1377073&locale=en-gb",
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.request(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			var d = JSON.parse(body.toString());
			console.log(d);
			resp.write("<h1 style=color:red;text-align:center;font-family: Verdana, Geneva, Tahoma, sans-serif;>Most Relaxing Place</h1>")
			d.forEach(e => {
				var u1 = e.url_max
				var u2 = u1.replace('1280x900', '700x400')
				resp.write("<h1 style=text-align:center;><img style=max-width:90%; src=" + u2 + "></h1>" + "<br></br>")
			});
		});
	});

	reqt.end();
})

app.get('/book.html', function (req, res) {
	res.sendFile(__dirname + '/book.html')
})

app.post('/book.html', function (req, resp) {
	l = req.body.loc
	hid = req.body.hid
	const options = {
		"method": "GET",
		"hostname": "booking-com.p.rapidapi.com",
		"port": null,
		"path": "/v1/hotels/data?locale=" + l + "&hotel_id=" + hid,
		"headers": {
			"x-rapidapi-host": "booking-com.p.rapidapi.com",
			"x-rapidapi-key": "35a6908e80msh423624a6e10e5fep140dc5jsn31b813c52687",
			"useQueryString": true
		}
	};

	const reqt = https.request(options, function (res) {
		const chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			const body = Buffer.concat(chunks);
			var d = JSON.parse(body.toString());
			var url = d.url
			resp.redirect(url)
		});
	});

	reqt.end();
})


app.get('/about.html', function (req, res) {
	res.sendFile(__dirname + '/about.html')
})

app.get('/contact.html', function (req, res) {
	res.sendFile(__dirname + '/contact.html')
})


app.listen(process.env.PORT || 3000, () => {
	console.log("Server started on port 3000.");
})

//    background-image: url("https://media-cdn.tripadvisor.com/media/vr-splice-j/01/fd/1f/a0.jpg");
//    background-image: url("https://cache.marriott.com/marriottassets/marriott/SJOLS/sjols-view-0138-hor-feat.jpg");
//    background-image: url("https://lh3.googleusercontent.com/zOh4gcwX7SBwJ-EkUQm-kCrLCpvs8kxt9-ZOs3iLAS5wBGGyVlN175Fa4QTD9IDf4-mv13OGMXZyNBtY2PWz2AFP=s1000");
