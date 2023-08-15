var valueToIndex = {}

const get = async function getRequest(link){
const req = await fetch(link)
if (req.status === 200) 
    return req.json()
else
    return null
}

function eraseDropDown(){
    timeDropDown.innerHTML = ""
    screenDropDown.innerHTML = ""
}

function makeOptionTimeAndScreen(movie){
    for (var i of movie.time) {
        let option = document.createElement("option")
        timeDropDown.appendChild(option)
        option.value = i
        option.innerHTML = i
    }
    for (var i of movie.screens) {
        let option = document.createElement("option")
        screenDropDown.appendChild(option)
        option.value = i
        option.innerHTML = i
    }
}


function makeOptionMovie(parent,movie){
    let option = document.createElement("option")
    parent.appendChild(option)
    option.value = movie.value
    option.innerHTML = movie.name
}

function changeCover(url){
    const cover = document.getElementById("cover")
    cover.src = url
}

const movieDropDown = document.getElementById('movie')
const timeDropDown = document.getElementById("time")
const screenDropDown = document.getElementById('screen')
var movies
async function setup(){
const url =  window.location.origin
movies = await get(`${url}/movies`)
if (!location.href.includes('admin')){
changeCover(movies[0].cover_url)
makeOptionTimeAndScreen(movies[0])
let x = 0
for (const movie of movies){
    makeOptionMovie(movieDropDown,movie)
    valueToIndex[movie.value] = x
    x++
}

}
}
await setup()
if (!location.href.includes('admin')) {
movieDropDown.addEventListener('change',function() {
    const value = movieDropDown.value
    changeCover(movies[valueToIndex[value]].cover_url)
    eraseDropDown()
    makeOptionTimeAndScreen(movies[valueToIndex[value]])
})
}


async function clearDropdowns(){
    movieDropDown.innerHTML = ''
    timeDropDown.innerHTML = ''
    screenDropDown.innerHTML = ''
}
export default async function refreshMovies(){
    if (location.href.includes('admin')) return
    alert('Movie Updated')
    await clearDropdowns()
    await setup()
}
