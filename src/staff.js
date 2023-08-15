const { Router } = require('express');
const fs = require('fs');
const router = new Router();
router.get('/', async (request, response) => {
	response.sendFile(__dirname.replace('\src',"") + "./views/staff/home.html")
});

module.exports = router
