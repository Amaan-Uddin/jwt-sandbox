const jwt = require('jsonwebtoken')
const { accessTokenPrivateKey, refreshTokenPrivateKey } = require('../../config/config.env')

function signAccessToken(payload) {
	return jwt.sign(payload, accessTokenPrivateKey, { algorithm: 'RS256', expiresIn: '30s' })
}

function signRefreshToken(payload) {
	return jwt.sign(payload, refreshTokenPrivateKey, { algorithm: 'RS256', expiresIn: '45s' })
}

module.exports = { signAccessToken, signRefreshToken }
