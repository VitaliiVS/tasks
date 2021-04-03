export class ApiCall {
    constructor(method, body, token) {
        this.method = method
        this.cache = 'no-cache'
        this.headers = {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
        if (body !== null) {
            this.body = JSON.stringify(body)
        }
    }
}