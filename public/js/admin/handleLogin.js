const usernameElement = document.getElementById('username')
const passwordElement = document.getElementById('password')
const loginButton = document.getElementById('login')
const errorElement = document.getElementById('err')

async function getRequest(link){
    const req = await fetch(link)
    if (req.status === 200) 
        return req.json()
    else
        return null
    }

const url =  window.location.href

loginButton.addEventListener('click',async function(event){
    const username = usernameElement.value
    const password = passwordElement.value
    const input = {"username": username,"password": password}
    if (username === '' || password === '') return
    errorElement.classList.add('off')
    const admins = await getRequest(`${url.replace('login','admins')}`)
    if (!loginUser(admins,input)){
        errorElement.classList.remove('off')
        return
    }
    document.cookie = `logininfo = ${JSON.stringify(input)}; expires=${(Date.UTC + (1 * 60 * 60 * 1000))}; path=/;`
    window.location.replace('/admin/home')
})

function loginUser(admins,input){
    const username = input.username
    const password = input.password
    for (let admin of admins){
        if (admin.username === username && admin.password === password)
            return true
    }
    return false
}

// Add an event listener to the input field to detect key presses
passwordElement.addEventListener('keyup', function(event) {
    // Check if the key pressed is the Enter key (key code 13)
    if (event.key === "Enter") {
      // Trigger the button click
      loginButton.click();
    }
  });

  // Add an event listener to the input field to detect key presses
usernameElement.addEventListener('keyup', function(event) {
    // Check if the key pressed is the Enter key (key code 13)
    if (event.key === "Enter") {
      // Trigger the button click
      passwordElement.focus()
    }
  });