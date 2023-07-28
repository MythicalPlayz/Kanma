const addButton = document.getElementById('add')
const removeButton = document.getElementById('remove')
const databaseButton = document.getElementById('database')
const url = window.location.origin
import updateFun  from "../handleupdate.js"

addButton.addEventListener('click',function(){
    window.location.replace('/admin/add')
})

removeButton.addEventListener('click',function(){
    window.location.replace('/admin/remove')
})

databaseButton.addEventListener('click',async function(){
    const req = await fetch(`${url}/admin/database/drop`)
    if (req.status === 200 && await req.text() === 'DONE'){
        console.log('Removed Database')
        updateFun({"type": "reset"})
    }
    else
    console.error('Error')
})