const fs = require('fs');
function getMovie(movie){
    try {
    return JSON.parse(fs.readFileSync(`./database/movies/${movie}.json`))
    }
    catch (e) {
        return null
    }
}
module.exports = {
    getMovie
}