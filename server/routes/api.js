const express = require('express')
const router = express.Router()

const loginHandler = require('../controllers/login.controller')
const authenticateUser = require('../utils/middleware/authenticateUser')
const logoutHandler = require('../controllers/logout.controller')

router.post('/login', loginHandler)
router.post('/logout', logoutHandler)

router.get('/current-session', authenticateUser, (req, res) => {
	res.status(200).json(req.user)
})

module.exports = router
