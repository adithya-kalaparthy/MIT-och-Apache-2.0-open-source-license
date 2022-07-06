// imports
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

//use cors

app.use(cors());
app.use(cors({
	methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));


//static files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + '/public/css'))
app.use('/img', express.static(__dirname + '/public/img'))
app.use('/js', express.static(__dirname + '/public/js'))

app.get('', (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
})

// list on port 3000
app.listen(port, () => console.info(`listening on port ${port}`))

