import { ApiCall } from './api'
import { uuid } from './uuid'

export class Session {
	login = async (url: string, username: string, password: string) => {
		const data = {
			username: username.toLowerCase(),
			password: password
		}
		const apiCall: any = new ApiCall('POST', data, null)
		const response = await fetch(url, apiCall)

		if (response.ok) {
			const content = await response.json()
			document.cookie = `token=${content.token}`

			return content.token
		} else {
			return
		}
	}

	register = async (
		registerUrl: string,
		username: string,
		password: string
	) => {
		const data = {
			username: username.toLowerCase(),
			password: password,
			userId: uuid()
		}
		const apiCall: any = new ApiCall('POST', data, null)
		const response = await fetch(registerUrl, apiCall)

		if (response.ok) {
			const content = await response.json()
			document.cookie = `token=${content.token}`

			return content.token
		} else {
			return
		}
	}
}
