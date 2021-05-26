import React, { Dispatch, SetStateAction, useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MailIcon from '@material-ui/icons/Mail'
import useStyles from './BoardsDrawerStyles'

interface BoardsDrawerProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const BoardsDrawer = (props: BoardsDrawerProps): JSX.Element => {
  const { open, setOpen } = props
  const { fullList } = useStyles()

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open)
  }

  const list = () => (
    <div className={fullList} onClick={toggleDrawer(false)}>
      <List>
        {['list of items'].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <div>
      <Drawer anchor={'left'} open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  )
}

export default BoardsDrawer
