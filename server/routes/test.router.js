const express = require('express');
const router = express.Router();
require('dotenv').config()

router.get('/', async (req, res) => {
	try {
		console.log("Test GET route has been tested successfully!")
	} catch (err) {
		console.error("Error in the Test GET route: ", err.message);
	}
});

router.post('/', async (req, res) => {
	try {
		console.log("Test POST route has been tested successfully!")
	} catch (err) {
		console.error("Error in the Test POST route: ", err.message);
	}
});

module.exports = router;
