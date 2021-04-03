export class ApiCall {
    constructor(method, token, body) {
        this.method = method
        this.cache = 'no-cache'
        this.headers = {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
        if (body) {
            this.body = JSON.stringify(body)
        }
    }
}