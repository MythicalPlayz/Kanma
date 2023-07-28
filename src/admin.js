const { Router } = require('express');
const fs = require('fs');
const router = new Router();
router.get('/', async (request, response) => {
	if (isLoggedIn(request,response))
	response.redirect('/admin/home')
});

router.get('/login', async (request, response) => {
	if (!isLoggedIn(request,response))
	response.sendFile(__dirname.replace('\src',"") + '/views/admin/login.html')
	else
	response.redirect('/admin/home')
});
router.get('/admins', async (request, response) => {
	response.json(getAdmins())
});

router.get('/add', async (request, response) => {
	if (isLoggedIn(request,response))
	response.sendFile(__dirname.replace('\src',"") + '/views/admin/add.html')
});

router.get('/remove', async (request, response) => {
	if (isLoggedIn(request,response))
	response.sendFile(__dirname.replace('\src',"") + '/views/admin/remove.html')
});

router.get('/edit', async (request, response) => {
	if (isLoggedIn(request,response))
	response.sendFile(__dirname.replace('\src',"") + '/views/admin/edit.html')
});

router.get('/home', async (request, response) => {
	if (isLoggedIn(request,response))
	response.sendFile(__dirname.replace('\src',"") + '/views/admin/home.html')

});

module.exports = router

function getAdmins() {
    let final = []
    let admins = fs.readdirSync('./database/admins')
    admins.forEach(file => {
        if (file !== "example.json") {
            let admin = fs.readFileSync(`./database/admins/${file}`)
            final.push(JSON.parse(admin))
        }
    })
    return final;
}

function getLoginInfo(cookiesTable){
	for (cookie of cookiesTable){
		if (!cookie.includes('logininfo')) continue
		const info = JSON.parse(cookie.split("=")[1])
		const username = info.username
		const password = info.password
		if (username === undefined || password === undefined)
			return false
		if (loginUser(getAdmins(),username,password))
			return true
		return false
	}
	return false
}

function loginUser(admins,username,password){
    for (let admin of admins){
        if (admin.username === username && admin.password === password)
            return true
    }
    return false
}

function isLoggedIn(request,response,preventRedirect){
	const cookies = request.headers.cookie
	if (cookies === undefined){
		if (!request.originalUrl.match('login') && !preventRedirect)
			response.redirect('/admin/login')
	return false
	} else {
	const cookiesTable = cookies.split(';')
	if (!getLoginInfo(cookiesTable)){
		if (!request.originalUrl.match('login') && !preventRedirect)
			response.redirect('/admin/login')
	return false
	}
	return true
	}
}

router.get('/database/drop', async (request, response) => {
    if (!isLoggedIn(request,response,true))
		response.send('No Admin ?')
	else {
	removeBookings()
    response.send('DONE')
	}
})

function removeBookings() {
    let bookings = fs.readdirSync('./database/bookings')
    bookings.forEach(file => {
        if (file !== "example.json") {
            	fs.unlink(`./database/bookings/${file}`, (err) => {
				if (err) {
				  console.error('Error deleting the file:', err);
				} else {
				  console.log('File deleted successfully.');
				}
			})
        }
    })
}

