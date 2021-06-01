import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  loginContainer: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginHeader: {
    color: '#5d6161'
  },
  loginInput: {
    width: 300
  },
  loginButton: {
    width: 130
  }
})

export default useStyles
