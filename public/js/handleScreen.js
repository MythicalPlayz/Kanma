const url = window.location.origin

const get = async function getRequest(link) {
    const req = await fetch(link)
    if (req.status === 200)
        return req.json()
    else
        return null
}

const movieDropDown = document.getElementById('movie')
const timeDropDown = document.getElementById("time")
const screenDropDown = document.getElementById('screen')
const mainHall = document.getElementById("cinema")

async function changeScreen() {
    await delay(100) //wait until new value of screen
    clearSeats()
    let screenName = screenDropDown.value
    let screen = await get(`${url}/screens/${screenName}`)
    screen = screen[0]
    let rows = screen.seat_layout
    let width = screen.width
    let seatLetter = 'A'
    for (let i of rows) {
        addRow(width,i,seatLetter)
        seatLetter = String.fromCharCode(seatLetter.charCodeAt(0) + 1)
    }
    setSeatEvent()
}

function clearSeats() {
    while (mainHall.children.length !== 1){
        mainHall.children[mainHall.children.length - 1].remove()
    }
}

function addRow(width,row,letter) {
    let div = document.createElement("div")
    mainHall.appendChild(div)
    div.classList.add("row")
    let seatcount = 0
    let seatnum = 1
    for (let i of row){
        let x = 0
        while (x < i){
            addSeat(`${letter}${seatnum}`,div)
            x++
            seatcount++
            seatnum++
        }
        if (seatcount < width){
            addSeat(null,div)
            seatcount++
        }
    }
}

function addSeat(number,rowElement) {
    let div = document.createElement("div")
    rowElement.appendChild(div)
    div.classList.add("seat")
    if (number !== null){
        let div2 = document.createElement("div")
        div.appendChild(div2)
        div2.classList.add("seat-text")
        div2.innerHTML = number
        div.id = number
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

movieDropDown.addEventListener('change', changeScreen)
timeDropDown.addEventListener('change', changeScreen)
screenDropDown.addEventListener('change', changeScreen)
changeScreen()

function setSeatEvent() {
    var divs = document.getElementsByClassName('seat');
    for (let div of divs)
    div.addEventListener('click', function (event) {
    preBookSeat(div)
 });
}

function preBookSeat(div) {
    let e = div.getElementsByClassName("seat-text")[0]
    if (e !== null && !e.classList.contains("booked"))
    {
        if (!e.classList.contains("prebook"))
        e.classList.add("prebook")
        else
        e.classList.remove("prebook")
    }
}
