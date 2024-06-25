const userDB = {
	users: require('../db/User'),
	setUsers: function (user_data) {
		this.users = user_data
	},
}
const TokenDB = {
	tokens: require('../db/Tokens.json'),
	setTokens: function (token_data) {
		this.tokens = token_data
	},
}

const fsPromises = require('fs').promises
const path = require('path')
const { findUser, signAccessToken, signRefreshToken } = require('../utils/index')

module.exports = async function loginHandler(req, res) {
	try {
		const { email, password } = req.body
		if (!email || !password) return res.status(400).json({ error: 'Invalid request.' })

		// check for user in db
		const user = findUser(userDB.users, email)
		if (!user) return res.status(404).json({ error: 'Not found.' })

		console.log(user)

		// check if the password provided is correct
		if (password !== user.password) return res.status(401).json({ error: 'Email or Password is incorrect.' })

		// if everything is correct, create a jwt token and send it to client
		const accessToken = signAccessToken({ payload: { userId: user._id, email: user.email } })
		const refreshToken = signRefreshToken({ payload: { userId: user._id, email: user.email } })

		console.log('\nAccessToken: ', accessToken)
		console.log('\nRefreshToken: ', refreshToken)

		// map the token data
		const mappedTokens = TokenDB.tokens.map((token) => {
			if (token.userId === user._id) {
				return {
					...token,
					refreshToken: refreshToken,
					expiresIn: new Date(Date.now() + 45 * 1000),
				}
			}
			return token
		})

		console.log(mappedTokens)

		TokenDB.setTokens(mappedTokens)

		await fsPromises.writeFile(path.join(__dirname, '..', 'db', 'Tokens.json'), JSON.stringify(TokenDB.tokens))

		// send tokens to client and save refresh token in db
		res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 30 * 1000 })
		res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 45 * 1000 })

		res.status(200).json(user)
	} catch (error) {
		console.log(error)
		throw error
	}
}
