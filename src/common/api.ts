import { Task } from './task'

interface authBody {
  username: string
  password: string
}

export class ApiCall {
  method: string
  cache: RequestCache
  headers: {
    'Content-Type': string
    authorization: string
  }
  body?: BodyInit | null

  constructor(method: string, body: authBody | Task | null, token?: string) {
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
