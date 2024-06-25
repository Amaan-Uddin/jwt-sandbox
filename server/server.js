const express = require('express')
const app = express()

require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors')

const apiRouter = require('./routes/api')

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:5173',
	})
)

app.use('/api', apiRouter)

const PORT = 3000
app.listen(PORT, console.log('Server running on port', PORT))
