const url = window.location.href
const movieDropDown = document.getElementById('movie')
const timeDropDown = document.getElementById("time")
const screenDropDown = document.getElementById('screen')
import updateFun  from "./handleupdate.js"
async function postRquest(movie,time,screen,seats){
   var res = await fetch(`${url}book/${movie}/${time}/${screen}`, {
        method: 'POST',
        body: JSON.stringify({
            seats: seats
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
}

async function getRequest(link) {
    const req = await fetch(link)
    if (req.status === 200)
        return req.json()
    else
        return null
}

function getURL(){
    var movie = document.getElementById('movie').value
    var time = document.getElementById("time").value
    var screen = document.getElementById('screen').value
    return `${url}book/${movie}/${time}/${screen}`
}

const bookButton = document.getElementById('bookbtn')
bookButton.addEventListener('click', (event) => {
    var movie = document.getElementById('movie').value
    var time = document.getElementById("time").value
    var screen = document.getElementById('screen').value
    const seats = document.getElementsByClassName("seat-text")
    let bookseats = []
    for (let seat of seats){
        if (seat.classList.contains("prebook"))
            bookseats.push(seat.innerHTML)
    }
    if (bookseats.length === 0) return
    postRquest(movie,time,screen,bookseats)
    updateFun({movie,time,screen,bookseats})
    setupBooked()
})

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function setupBooked(){
    var data = await getRequest(getURL())
    if (data.seatdata === undefined) return
    var seatdata = data.seatdata
    await delay(250)
    for (var seat of seatdata){
        var mainseat = document.getElementById(seat)
        mainseat.children[0].innerHTML = "X"
        mainseat.children[0].classList.add("booked")
        mainseat.children[0].classList.remove("prebook")
    }
}

await delay(250)
setupBooked()

movieDropDown.addEventListener('change', setupBooked)
timeDropDown.addEventListener('change', setupBooked)
screenDropDown.addEventListener('change', setupBooked)