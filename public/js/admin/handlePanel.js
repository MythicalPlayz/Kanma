const addMovieButton = document.getElementById('add-movie')
const removeMovieButton = document.getElementById('remove-movie')
const editMovieButton = document.getElementById('edit-movie')
const addScreenButton = document.getElementById('add-screen')
const removeScreenButton = document.getElementById('remove-screen')
const editScreenButton = document.getElementById('edit-screen')
const databaseButton = document.getElementById('database')
const url = window.location.origin
import updateFun  from "../handleupdate.js"

addMovieButton.addEventListener('click',function(){
    window.location.replace('/admin/movies/add')
})

removeMovieButton.addEventListener('click',function(){
    window.location.replace('/admin/movies/remove')
})

editMovieButton.addEventListener('click',function(){
    window.location.replace('/admin/movies/edit')
})

addScreenButton.addEventListener('click',function(){
    window.location.replace('/admin/screens/add')
})

removeScreenButton.addEventListener('click',function(){
    window.location.replace('/admin/screens/remove')
})

editScreenButton.addEventListener('click',function(){
    window.location.replace('/admin/screens/edit')
})

databaseButton.addEventListener('click',async function(){
    const req = await fetch(`${url}/admin/database/drop`)
    if (req.status === 200 && await req.text() === 'DONE'){
        console.log('Removed Database')
        updateFun({"type": "reset"})
        alert('All Bookings Removed')
    }
    else
    console.error('Error')
})
function setupName(inputString) {
const index = inputString.indexOf('logininfo');
const info = inputString.substring(index).split(';')[0].split("=")[1];
const username = JSON.parse(info).username
document.getElementById('user').innerHTML = `Welcome, ${username}`
}

setupName(document.cookie)