import { ApiCall } from '../common/api'
import { v4 as uuidv4 } from 'uuid'

const apiCall = new ApiCall()

export class Session {
  login = async (
    url: string,
    username: string,
    password: string
  ): Promise<string> => {
    const data = {
      username: username.toLowerCase(),
      password: password
    }
    const response = await apiCall.makeApiCall(url, 'POST', data)

    if (response.ok) {
      const content = await response.json()
      document.cookie = `token=${content.token}`

      return content.token
    } else if (response.status === 400) {
      throw new Error('Incorrect username or password')
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  register = async (
    url: string,
    username: string,
    password: string
  ): Promise<string> => {
    const data = {
      username: username.toLowerCase(),
      password: password,
      userId: uuidv4()
    }
    const response = await apiCall.makeApiCall(url, 'POST', data)

    if (response.ok) {
      const content = await response.json()
      document.cookie = `token=${content.token}`

      return content.token
    } else if (response.status === 409) {
      throw new Error('Username already in use')
    } else {
      throw new Error(`${response.statusText}`)
    }
  }
}
