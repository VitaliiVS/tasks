export class ApiCall {
	method: string
	cache: string
	headers: any
	body: any

	constructor(method: string, body: any, token: string | null) {
		this.method = method
		this.cache = 'no-cache'
		this.headers = {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`
		}
		if (body !== null) {
			this.body = JSON.stringify(body)
		}
	}
}
