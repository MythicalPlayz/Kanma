const { Router } = require('express');
const fs = require('fs');
const router = new Router();
const movieMangerModule = require('./modules/movieManager.js');
const bodyParser = require('body-parser');
router.get('/:movie/:time/:screen/', async (request, response) => {
    var movie = request.params.movie;   
    var time = request.params.time;
    var screen = request.params.screen;
    var bookingInfo = readFile(`${movie}-${time}-${screen}`)
    if (bookingInfo === null) response.send({})
    else response.json(bookingInfo)
    
});

router.post('/:movie/:time/:screen/',bodyParser.json(), async (request, response) => {
    let seatData = request.body.seats;
    var movie = request.params.movie;   
    var time = request.params.time;
    var screen = request.params.screen;
    writeFile(`${movie}-${time}-${screen}`,seatData)
})

function readFile(filename){
    filename = filename.replace(" ",'')
    filename = filename.replace(" ",'')
    filename = filename.replace(':','')
    try {
    let bookingData = fs.readFileSync(`./database/bookings/${filename}.json`)
        return JSON.parse(bookingData)
    }
    catch (e) {
        return null
    }
}

function writeFile(filename,seatData){
    filename = filename.replace(" ",'')
    filename = filename.replace(" ",'')
    filename = filename.replace(':','')
    let oldData = readFile(filename)
    if (oldData !== null){
    oldData = oldData.seatdata
    let finaldata = oldData.concat(seatData.filter((item) => oldData.indexOf(item) < 0));
    fs.writeFileSync(`./database/bookings/${filename}.json`, JSON.stringify({"seatdata": finaldata}))
    }
    else
    fs.writeFileSync(`./database/bookings/${filename}.json`, JSON.stringify({"seatdata": seatData}))
}

module.exports = router