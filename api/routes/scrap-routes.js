const express = require('express');
const router = express.Router();
const scrapRouter = require('../controller/scrap-controller');

//Returns scrapped data
router.get('/get-info', (req, res) => {
	scrapRouter.getInfo(req.query.q,req.query.maxPages,req.query.startPage ).then((data) => {
		res.status(201).send(data);
	}).catch((err) => {
		console.log(err);
		
		res.status(500).send(err);
	});
});


module.exports = router;
