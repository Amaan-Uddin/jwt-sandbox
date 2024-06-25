const TokenDB = {
	tokens: require('../db/Tokens.json'),
	setTokens: function (token_data) {
		this.tokens = token_data
	},
}

const fsPromises = require('fs').promises
const path = require('path')
const { verifyRefreshToken } = require('../utils')

module.exports = async function logoutHandler(req, res) {
	const refreshToken = req.cookies?.refreshToken
	if (!refreshToken) {
		return res.status(409).json({ error: 'No Token' })
	}

	const isPresent = TokenDB.tokens.find((token) => token.refreshToken === refreshToken)
	if (!isPresent) return res.status(404).json({ error: 'Token not found' })

	try {
		const decode = verifyRefreshToken(refreshToken)
		const modifiedTokens = TokenDB.tokens.map((token) => {
			if (token.userId === decode.payload.userId && token.refreshToken === refreshToken)
				return {
					...token,
					refreshToken: null,
					expiresIn: null,
				}
			return token
		})

		console.log(modifiedTokens)

		TokenDB.setTokens(modifiedTokens)

		await fsPromises.writeFile(path.join(__dirname, '..', 'db', 'Tokens.json'), JSON.stringify(TokenDB.tokens))

		res.clearCookie('accessToken')
		res.clearCookie('refreshToken')

		res.status(200).json({ message: 'Successfully logged out.' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Internal server error.' })
	}
}
