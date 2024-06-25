const { verifyAccessToken, refreshAccessToken } = require('../index')

module.exports = async function authenticateUser(req, res, next) {
	const accessToken = req.cookies?.accessToken
	if (!accessToken) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	try {
		const decode = verifyAccessToken(accessToken)
		console.log('AccessToken Decode: ', decode)
		req.user = decode
		next()
	} catch (error) {
		console.log(error)
		if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
			const refreshToken = req.cookies?.refreshToken
			if (!refreshToken) {
				return res.status(401).json({ error: 'Unauthorized (no refresh token).' })
			}
			try {
				const newAccessToken = await refreshAccessToken(refreshToken)
				const decode = verifyAccessToken(newAccessToken)
				console.log('new AccessToken Decode: ', decode)
				res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 30 * 1000 })
				req.user = decode
				next()
			} catch (error) {
				console.log(error)
				res.clearCookie('accessToken')
				res.clearCookie('refreshToken')
				return res.status(401).json({ error: 'Unauthorized (refresh failed).' })
			}
		} else {
			return res.status(500).json({ error: 'Internal server error.' })
		}
	}
}
