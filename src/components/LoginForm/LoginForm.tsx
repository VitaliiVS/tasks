import React, { useContext, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import { Visibility, VisibilityOff } from '@material-ui/icons'

import { SessionContextProps, SessionContext } from '../TasksContext'
import { debounce } from '../../common/helpers'
import { loginUrl, registerUrl } from '../../common/config'
import useStyles from './LoginFormStyles'

const LoginForm = (): JSX.Element => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({
    username: false,
    password: false
  })
  const { login, register } = useContext(SessionContext) as SessionContextProps
  const { loginContainer, loginHeader, loginInput, loginButton } = useStyles()

  const handleLogin = async (): Promise<void> => {
    try {
      await login(loginUrl, username, password)
    } catch (e) {
      alert(e.message)
    }
  }

  const handleRegister = async (): Promise<void> => {
    try {
      await register(registerUrl, username, password)
    } catch (e) {
      alert(e.message)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoginDebounced()
    }
  }

  const handleBlur = (field: string) => () => {
    setTouched({ ...touched, [field]: true })
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLoginDebounced = debounce(handleLogin, 200)
  const handleRegisterDebounced = debounce(handleRegister, 200)
  const disabled = username.trim().length === 0 || password.trim().length === 0
  const loginEmpty = username.trim().length === 0 && touched.username
  const passEmpty = password.trim().length === 0 && touched.password
  const loginHelperText = loginEmpty ? 'This field is required' : ''
  const passHelperText = passEmpty ? 'This field is required' : ''
  const showPass = showPassword ? <Visibility /> : <VisibilityOff />
  const fieldType = showPassword ? 'text' : 'password'

  return (
    <div className={loginContainer}>
      <Grid
        container
        direction="column"
        spacing={8}
        justify="center"
        alignItems="center"
      >
        <Grid item xs>
          <Typography className={loginHeader} variant="h3" component="h1">
            Login or Register
          </Typography>
        </Grid>
        <Grid item xs>
          <Grid
            container
            spacing={3}
            direction="column"
            justify="flex-end"
            alignItems="center"
          >
            <Grid item xs>
              <TextField
                error={loginEmpty}
                label="Username"
                value={username}
                placeholder="Username"
                onChange={handleUsernameChange}
                onKeyUp={handleKeyUp}
                onBlur={handleBlur('username')}
                className={loginInput}
                helperText={loginHelperText}
              />
            </Grid>
            <Grid item xs>
              <TextField
                error={passEmpty}
                label="Password"
                value={password}
                placeholder="Password"
                type={fieldType}
                onChange={handlePasswordChange}
                onKeyUp={handleKeyUp}
                onBlur={handleBlur('password')}
                className={loginInput}
                helperText={passHelperText}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword}>
                        {showPass}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs>
              <Grid container spacing={4}>
                <Grid item xs>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLoginDebounced}
                    className={loginButton}
                    disabled={disabled}
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleRegisterDebounced}
                    className={loginButton}
                    disabled={disabled}
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default LoginForm
