import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  title: {
    margin: 0,
    padding: 5,
    fontSize: '1.125em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    minWidth: 330,
    maxWidth: 330
  },
  completed: {
    textDecoration: 'line-through',
    color: 'gray'
  },
  editViewStyles: {
    margin: [0, 1, 0, 0],
    padding: 5,
    fontSize: '1.125em',
    overflow: 'hidden',
    minWidth: 340,
    maxWidth: 340
  },
  '@media (max-width: 576px)': {
    title: {
      minWidth: 160,
      maxWidth: 160
    },
    editViewStyles: {
      minWidth: 157,
      maxWidth: 157
    }
  }
})

export default useStyles
