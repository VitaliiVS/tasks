import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  tasksHeader: {
    color: '#5d6161',
    textAlign: 'center',
    marginLeft: 100
  },
  logoutButton: {
    top: 0
  },
  taskInput: {
    fontSize: '1.125em',
    width: 300,
    '& placeholder': {
      color: 'rgba(0, 0, 0, 0.5)'
    }
  },
  '@media (max-width: 576px)': {
    taskInput: {
      width: 230
    }
  }
})

export default useStyles
