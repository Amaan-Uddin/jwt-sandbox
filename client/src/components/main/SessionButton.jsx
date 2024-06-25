import { Button, Container, Display } from '../index'
import { useState } from 'react'
import config from '../../config/config.env'

function SessionButton({ logout, setLogout, setLoginOrSession }) {
	const [error, setError] = useState(null)
	const [session, setSession] = useState(null)
	async function getSession(e) {
		e.preventDefault()
		try {
			const response = await fetch(`${config.serverUrl}/api/current-session`, {
				method: 'GET',
				credentials: 'include',
			})
			const responseObj = await response.json()
			if (!response.ok) throw new Error(responseObj.error || 'Failed to fetch session.')
			setSession(responseObj)
			logout ? setLogout(false) : null
			setError(null)
		} catch (error) {
			console.log(error)
			setError(error.message)
		} finally {
			setLoginOrSession(true)
		}
	}
	return (
		<Container>
			<Button type={'button'} onClick={getSession}>
				Session
			</Button>
			{error && <p>{error}</p>}

			<Display>{<pre>{!error && session && !logout && JSON.stringify(session, null, 2)}</pre>}</Display>
		</Container>
	)
}
export default SessionButton
