import React from 'react'
import LoginForm from './LoginForm'
import TasksForm from './TasksForm'

interface State {
	token: string
}

class App extends React.Component<unknown, State> {
	constructor(props: unknown) {
		super(props)

		this.state = {
			token: ''
		}
	}

	componentDidMount() {
		if (document.cookie !== '') {
			const cookie = document.cookie
			const token = cookie.toString().slice(6)
			this.setState({ token })
		}
	}

	handleTokenChange = (token: string) => {
		this.setState({ token })
	}

	render() {
		const { token } = this.state

		if (token !== '') {
			return (
				<TasksForm
					token={token}
					onTokenChange={this.handleTokenChange}
				/>
			)
		} else {
			return <LoginForm onTokenChange={this.handleTokenChange} />
		}
	}
}

export default App
