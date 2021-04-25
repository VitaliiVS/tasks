export class ApiCall {
  method: string
  cache: string
  headers: {
    'Content-Type': string
    authorization: string
  }
  body: unknown

  constructor(method: string, body: unknown, token: string | null) {
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
