const TokenDB = {
	tokens: require('../../db/Tokens.json'),
	setTokens: function (token_data) {
		this.tokens = token_data
	},
}
const fsPromises = require('fs').promises
const path = require('path')
const { verifyRefreshToken } = require('./verifyTokens')
const { signAccessToken } = require('./signTokens')

module.exports = async function refreshAccessToken(refresh_token) {
	try {
		const decode = verifyRefreshToken(refresh_token)
		console.log('RefreshAccessToken :: refreshToken :: ', decode)
		return signAccessToken({ payload: decode.payload })
	} catch (error) {
		console.log(error)
		if (error.name === 'TokenExpiredError') {
			const tokenExist = TokenDB.tokens.find((token) => token.refreshToken == refresh_token)
			console.log(tokenExist)
			if (tokenExist) {
				const updatedTokens = TokenDB.tokens.map((token) => {
					if (token.refreshToken == refresh_token)
						return {
							...token,
							refreshToken: undefined,
							expiresIn: undefined,
						}
					return token
				})
				console.log('Removed expired tokens', updatedTokens)
				TokenDB.setTokens(updatedTokens)
				await fsPromises.writeFile(
					path.join(__dirname, '..', '..', 'db', 'Tokens.json'),
					JSON.stringify(updatedTokens)
				)
			}
		}
		throw error
	}
}
