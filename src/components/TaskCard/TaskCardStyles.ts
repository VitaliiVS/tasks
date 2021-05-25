import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  cardContainer: {
    margin: 'auto',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    width: 480
  },
  '@media (max-width: 576px)': {
    cardContainer: {
      width: 290
    }
  }
})

export default useStyles
