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
  handleLoginDebounced: () => void
  handleRegisterDebounced: () => void

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

  handleLogin = async (): Promise<void> => {
    const { onTokenChange } = this.props
    const { username, password } = this.state

    try {
      const login = await session.login(this.loginUrl, username, password)
      onTokenChange(login)
    } catch (e) {
      alert(e.message)
    }
  }

  handleRegister = async (): Promise<void> => {
    const { onTokenChange } = this.props
    const { username, password } = this.state

    try {
      const register = await session.register(
        this.registerUrl,
        username,
        password
      )
      onTokenChange(register)
    } catch (e) {
      alert(e.message)
    }
  }

  handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ password: e.target.value })
  }

  handleKeyUp = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.handleLoginDebounced()
    }
  }

  render(): React.ReactNode {
    const {
      handleUsernameChange,
      handlePasswordChange,
      handleKeyUp,
      handleLoginDebounced,
      handleRegisterDebounced
    } = this
    const { username, password } = this.state
    const disabled =
      username.trim().length === 0 || password.trim().length === 0

    return (
      <div>
        <h1 className="header">Login or Register</h1>
        <div className="login-container">
          <input
            value={username}
            onChange={handleUsernameChange}
            onKeyUp={handleKeyUp}
            className="name-input"
            type="text"
            placeholder="Username"
          />
          <input
            value={password}
            onChange={handlePasswordChange}
            onKeyUp={handleKeyUp}
            className="pass-input"
            type="password"
            placeholder="Password"
          />
          <button
            onClick={handleLoginDebounced}
            className="login-button"
            disabled={disabled}
          >
            Login
          </button>
          <button
            onClick={handleRegisterDebounced}
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
