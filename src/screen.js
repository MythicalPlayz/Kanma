const { Router } = require('express');
const fs = require('fs');
const router = new Router();
const movieModule = require('./movies.js')
router.get('/', async (request, response) => {
	response.json(getScreens())
});

router.get('/:screenname', async (request, response) => {
    var screen = request.params.screenname;
	response.json(getScreen(screen))
});

module.exports = router

function getScreens() {
    let final = []
    let screens = fs.readdirSync('./database/screens')
    screens.forEach(file => {
        if (file !== "example.json") {
            let screen = fs.readFileSync(`./database/screens/${file}`)
            final.push(JSON.parse(screen))
        }
    })
    return final;
}

function getScreen(screenname) {
    let final = []
    let screen = fs.readFileSync(`./database/screens/${screenname}.json`)
    final.push(JSON.parse(screen))
    return final;
}