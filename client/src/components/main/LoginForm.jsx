import { useState } from 'react'
import { Input, Button, Display, Container } from '../index'
import { useForm } from 'react-hook-form'
import config from '../../config/config.env'

function LoginForm({ logout, setLogout, setLoginOrSession }) {
	const { register, handleSubmit } = useForm()
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)
	async function login(data) {
		try {
			const response = await fetch(`${config.serverUrl}/api/login`, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-type': 'application/json',
				},
				credentials: 'include',
			})
			const responseData = await response.json()
			if (!response.ok) throw new Error(responseData.error || 'Failed to login user.')
			setData(responseData)
			setLoginOrSession(true)
			logout ? setLogout(false) : null
			setError(null)
		} catch (error) {
			console.log(error)
			setError(error.message)
		}
	}
	return (
		// `react-hook-form`’s `register` function tries to attach a ref to the Input component.
		// Since Input is a functional component, it needs to use `forwardRef` to pass the `ref` to the actual input element.
		<Container>
			<form onSubmit={handleSubmit(login)}>
				<Input
					{...register('email', { required: true })}
					type={'email'}
					label={'email'}
					placeholder={'enter email'}
					name={'email'}
				/>
				<Input
					{...register('password', { required: true })}
					type={'password'}
					label={'password'}
					placeholder={'enter password'}
					name={'password'}
				/>
				<Button type={'submit'}>Login</Button>
			</form>
			{error && <p>{error}</p>}
			<Display>
				<pre>{data && !logout && JSON.stringify(data, null, 2)}</pre>
			</Display>
		</Container>
	)
}
export default LoginForm
