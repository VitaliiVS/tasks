import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  cardContainer: {
    margin: 'auto',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    width: 380
  },
  title: {
    margin: 0,
    padding: 5,
    fontSize: '1.125em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    minWidth: 245,
    maxWidth: 245
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
    minWidth: 255,
    maxWidth: 255
  },
  '@media (max-width: 576px)': {
    cardContainer: {
      width: 290
    },
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
