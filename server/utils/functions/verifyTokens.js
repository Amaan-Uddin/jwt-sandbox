const jwt = require('jsonwebtoken')
const { accessTokenPublicKey, refreshTokenPublicKey } = require('../../config/config.env')

function verifyAccessToken(accessToken) {
	return jwt.verify(accessToken, accessTokenPublicKey, { algorithms: ['RS256'] })
}
function verifyRefreshToken(refreshToken) {
	return jwt.verify(refreshToken, refreshTokenPublicKey, { algorithms: ['RS256'] })
}

module.exports = { verifyAccessToken, verifyRefreshToken }
