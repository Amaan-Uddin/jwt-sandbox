import { LoginComponent, LogoutButton, SessionButton } from '../components/index'
import { useState } from 'react'

function Home() {
	const [logout, setLogout] = useState(false)
	const [loginOrSession, setLoginOrSession] = useState(false)
	return (
		<>
			<LoginComponent logout={logout} setLogout={setLogout} setLoginOrSession={setLoginOrSession} />
			<SessionButton logout={logout} setLogout={setLogout} setLoginOrSession={setLoginOrSession} />
			<LogoutButton setLogout={setLogout} loginOrSession={loginOrSession} setLoginOrSession={setLoginOrSession} />
		</>
	)
}
export default Home
