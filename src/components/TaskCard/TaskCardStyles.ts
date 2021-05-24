import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  cardContainerStyles: {
    margin: 'auto',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    width: 380
  },
  '@media (max-width: 576px)': {
    cardContainerStyles: {
      width: 290
    }
  }
})

export default useStyles
