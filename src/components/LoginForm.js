import React from 'react'
import { Session } from './session.js'
import { debounce } from 'lodash'

const session = new Session()

class LoginForm extends React.Component {
    constructor(props) {
        super(props)

        this.handleLoginDebounced = debounce(this.handleLogin.bind(this), 200)
        this.handleRegisterDebounced = debounce(this.handleRegister.bind(this), 200)

        this.loginUrl = 'http://127.0.0.1:3000/auth'
        this.registerUrl = 'http://127.0.0.1:3000/register'

        this.state = {
            username: '',
            password: ''
        }
    }

    async handleLogin() {
            const login = await session.login(this.loginUrl, this.state.username, this.state.password)
            if (login !== undefined) {
                this.props.onTokenChange(login)
            } else {
                alert('Incorrect username or password')
            }
    }

    async handleRegister() {
            const register = await session.register(this.registerUrl, this.state.username, this.state.password)
            if (register !== undefined) {
                this.props.onTokenChange(register)
            } else {
                alert('User already exist')
            }
    }

    render() {
        return (
            <div>
                <h1 className="header">Login or Register</h1>
                <div className="login-container">
                    <input
                        value={this.state.username}
                        onChange={(e) => this.setState({ username: e.target.value })}
                        onKeyUp={(e) => { if (e.key === 'Enter') this.handleLoginDebounced() }}
                        className="name-input"
                        type="text"
                        placeholder="Username"
                    />
                    <input
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                        onKeyUp={(e) => { if (e.key === 'Enter') this.handleLoginDebounced() }}
                        className="pass-input"
                        type="password"
                        placeholder="Password"
                    />
                    <button 
                        onClick={this.handleLoginDebounced}
                        className={"login-button"}
                        disabled={this.state.username.trim().length === 0 || this.state.password.trim().length === 0}>
                        Login
                    </button>
                    <button
                        onClick={this.handleRegisterDebounced}
                        className={"register-button"}
                        disabled={this.state.username.trim().length === 0 || this.state.password.trim().length === 0}>
                        Register
                    </button>
                </div>
            </div>
        )
    }
}

export default LoginForm