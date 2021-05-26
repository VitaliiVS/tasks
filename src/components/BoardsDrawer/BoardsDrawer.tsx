import React, { Dispatch, SetStateAction } from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import { Delete, Edit, ArrowForward } from '@material-ui/icons'
import ListSubheader from '@material-ui/core/ListSubheader'

import useStyles from './BoardsDrawerStyles'

interface BoardsDrawerProps {
  open: boolean
  setOpen: () => void
}

const BoardsDrawer = (props: BoardsDrawerProps): JSX.Element => {
  const { open, setOpen } = props
  const { fullList } = useStyles()

  return (
    <div>
      <Drawer anchor={'left'} open={open} onClose={setOpen}>
        <div className={fullList}>
          <List
            subheader={
              <ListSubheader component="div">Collections</ListSubheader>
            }
          >
            {['list of items'].map((text) => (
              <ListItem key={text}>
                <ListItemText primary={text} />
                <IconButton color="primary">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton color="secondary">
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton color="primary" onClick={setOpen}>
                  <ArrowForward fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  )
}

export default BoardsDrawer
