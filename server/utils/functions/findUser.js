module.exports = function findUser(arrayOfData, email) {
	const fetchUser = arrayOfData.find((user) => user.email === email)
	if (!fetchUser) return undefined
	return fetchUser
}
