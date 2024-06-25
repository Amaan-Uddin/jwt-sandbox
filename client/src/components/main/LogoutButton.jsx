import { Button, Container, Display } from '../index'
import { useState } from 'react'
import config from '../../config/config.env'

function LogoutButton({ setLogout, loginOrSession, setLoginOrSession }) {
	const [message, setMessage] = useState(null)
	const [error, setError] = useState(null)
	async function logout(e) {
		e.preventDefault()
		try {
			const response = await fetch(`${config.serverUrl}/api/logout`, {
				method: 'POST',
				credentials: 'include',
			})
			const responseObj = await response.json()

			if (!response.ok) throw new Error(responseObj.error || 'Failed to logout.')
			setMessage(responseObj.message)
			loginOrSession ? setLoginOrSession(false) : null
			setLogout(true)
			setError(null)
		} catch (error) {
			console.log(error)
			setError(error.message)
		}
	}
	return (
		<Container>
			<Button type={'button'} onClick={logout}>
				Logout
			</Button>

			{!loginOrSession && error && <p>{error}</p>}
			{!loginOrSession && !error && message && <Display>{message}</Display>}
		</Container>
	)
}
export default LogoutButton
