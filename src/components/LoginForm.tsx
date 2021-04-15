import React from 'react'
import { Session } from './session'
import { debounce } from 'lodash'
import { loginUrl, registerUrl } from './config'

const session = new Session()

interface LoginProps {
	onTokenChange: (token: string) => void
}

interface LoginState {
	username: string
	password: string
}

class LoginForm extends React.Component<LoginProps, LoginState> {
	loginUrl: string
	registerUrl: string
	handleLoginDebounced: any
	handleRegisterDebounced: any

	constructor(props: LoginProps) {
		super(props)

		this.loginUrl = loginUrl
		this.registerUrl = registerUrl

		this.handleLoginDebounced = debounce(this.handleLogin, 200)
		this.handleRegisterDebounced = debounce(this.handleRegister, 200)

		this.state = {
			username: '',
			password: ''
		}
	}

	handleLogin = async () => {
		const login = await session.login(
			this.loginUrl,
			this.state.username,
			this.state.password
		)
		if (login !== undefined) {
			this.props.onTokenChange(login)
		} else {
			alert('Incorrect username or password')
		}
	}

	handleRegister = async () => {
		const register = await session.register(
			this.registerUrl,
			this.state.username,
			this.state.password
		)
		if (register !== undefined) {
			this.props.onTokenChange(register)
		} else {
			alert('User already exist')
		}
	}

	handleUsernameChange = (e: any) => {
		this.setState({ username: e.target.value })
	}

	handlePasswordChange = (e: any) => {
		this.setState({ password: e.target.value })
	}

	handleKeyUp = (e: any) => {
		if (e.key === 'Enter') {
			this.handleLoginDebounced()
		}
	}

	render() {
		const { username, password } = this.state
		const disabled =
			this.state.username.trim().length === 0 ||
			this.state.password.trim().length === 0

		return (
			<div>
				<h1 className="header">Login or Register</h1>
				<div className="login-container">
					<input
						value={username}
						onChange={this.handleUsernameChange}
						onKeyUp={this.handleKeyUp}
						className="name-input"
						type="text"
						placeholder="Username"
					/>
					<input
						value={password}
						onChange={this.handlePasswordChange}
						onKeyUp={this.handleKeyUp}
						className="pass-input"
						type="password"
						placeholder="Password"
					/>
					<button
						onClick={this.handleLoginDebounced}
						className="login-button"
						disabled={disabled}
					>
						Login
					</button>
					<button
						onClick={this.handleRegisterDebounced}
						className="register-button"
						disabled={disabled}
					>
						Register
					</button>
				</div>
			</div>
		)
	}
}

export default LoginForm
