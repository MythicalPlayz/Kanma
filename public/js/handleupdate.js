// Client-side (Browser)
const socket = new WebSocket(window.location.href.replace('http','ws'));

socket.onopen = () => {
  
};

socket.onmessage = (event) => {
  let data = JSON.parse(event.data)
  if (data.type === 'add'){
    if (window.location.href.match('admin')) return
  let movie = document.getElementById('movie').value
  let time = document.getElementById("time").value
  let screen = document.getElementById('screen').value
  if (data.movie !== movie || data.time !== time || data.screen !== screen) return
  let seatData = data.bookseats
  for (let seat of seatData){
    let mainseat = document.getElementById(seat)
    mainseat.children[0].innerHTML = "X"
    mainseat.children[0].classList.add("booked")
    mainseat.children[0].classList.remove("prebook")
    }
  }
  else if (data.type === 'reset'){
    for (let seat of document.getElementsByClassName('seat')){
      if (seat.id === '') continue
    seat.children[0].innerHTML = seat.id
    seat.children[0].classList.remove("booked")
    seat.children[0].classList.remove("prebook")
    }
  }
};

socket.onerror = (error) => {
  console.error('WebSocket connection error:', error);
};

socket.onclose = () => {
  
};
export default function sendSeatData(seatData){
 socket.send(JSON.stringify(seatData))
 return
}