async function getRequest(link){
    const req = await fetch(link)
    if (req.status === 200) 
        return req.json()
    else
        return null
}

async function postRquest(movieInfo,type){
    let info = null
    try {info = JSON.parse(document.cookie.substring(document.cookie.indexOf('logininfo')).split(';')[0].split("=")[1])}
    catch (e) {}
    var res = await fetch(`${url}/admin/movies/${type}`, {
         method: 'POST',
         body: JSON.stringify({
             info: movieInfo,
             loginInfo: info,
         }),
         headers: {
             'Content-type': 'application/json; charset=UTF-8',
         },
     })
 }

const screenElement = document.getElementById('screen')

const MaxTime = 10

function setupScreen(screens){
    for (let screen of screens){
        let name = screen.name
        let div = document.createElement("div")
        screenElement.appendChild(div)
        div.classList.add("screen")
        div.innerHTML = name
        div.id = name
        let input = document.createElement('input')
        input.type = 'checkbox'
        div.appendChild(input)
        input.classList.add('check')
    }
}

const url = window.location.origin
let screens = await getRequest(`${url}/screens`)
setupScreen(screens)

const coverElement = document.getElementById('cover')
const coverUrlElement = document.getElementById('cover-url')
var isUrlValid = false
coverUrlElement.addEventListener('change',() => {
        let url = coverUrlElement.value
        coverElement.src = url
        isUrlValid = true
})

coverElement.addEventListener("error",() => {
    coverElement.src = 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'
    isUrlValid = false
})

const timeLabel = document.getElementsByClassName('time')[0]

const timeAmount = document.getElementById('number')

timeAmount.addEventListener('change',() => {
    let value = timeAmount.value
    value = Math.abs(value)
    if (value > 0 && value <= MaxTime) {
        var times = document.getElementsByClassName('time')
        if (times.length > value){
            while (times.length > value){
                times[times.length -1].remove()
            }
        }
        else if (times.length < value){
            while (times.length < value){
                const clone = timeLabel.cloneNode(true)
                document.getElementById("time").appendChild(clone)
            }
        }
    }
})

const submitButton = document.getElementById('save')

submitButton.addEventListener('click',() => {
   let times = handleTimes()
   if (times === null) return
   let screens = handleScreens()
   if (screens === null) return
   let generalInfo = getRemainingInfo()
   if (generalInfo === null) return
   postRquest({generalInfo,times,screens},'add')
})

function handleTimes(){
    let times = []
    let timesElement = document.getElementsByClassName('time')
    for (let timeElement of timesElement){
        const otime = timeElement.value
        if (otime === '') {alert('Empty Time'); return null}
        let time = ''
        let hour = parseInt(otime.split(":")[0])
        if (otime.startsWith('00')){
            time = '12'
            time += `:${otime.split(":")[1]}`
            time += ' AM'
        }
        else if (hour >= 12){
            time = (hour > 12) ? hour - 12 : hour
            time += `:${otime.split(":")[1]}`
            time += ' PM'
        }
        else {
            time = otime + ' AM'
        }
        times.push(time)
    } 
    return times
}

function handleScreens(){
    screens = []
    let screensElement = document.getElementsByClassName('screen')
    for (let screenElement of screensElement){
        if (screenElement.getElementsByClassName('check')[0].checked)
            screens.push(screenElement.id)
    }
    if (screens.length === 0) {alert("No Screen Selected"); return}
    return screens
}

function getRemainingInfo(){
    var rating = document.getElementById('rating').value
    var name = document.getElementById('name').value
    var codename = document.getElementById('code').value
    var cover = coverUrlElement.value
    if (name === ""){
        alert('Name String is empty')
        return null
    }
    if (codename === ""){
        alert('Code Name String is empty')
        return null
    }
    if (cover === ""){
        alert('Cover URL String is empty')
        return null
    }
    if (!isUrlValid){
        alert('Cover URL is Invalid')
        return null
    }
    return [rating,name,codename,cover]
}