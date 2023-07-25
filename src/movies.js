const { Router } = require('express');
const fs = require('fs');
const router = new Router();
router.get('/', async (request, response) => {
	response.json(getMovies())
});

module.exports = router

function getMovies() {
    let final = []
    let movies = fs.readdirSync('./database/movies')
    movies.forEach(file => {
        if (file !== "example.json") {
            let movie = fs.readFileSync(`./database/movies/${file}`)
            final.push(JSON.parse(movie))
        }
    })
    return final;
}