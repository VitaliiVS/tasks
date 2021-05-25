import React, { useContext, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { Delete, Edit, Save } from '@material-ui/icons'

import {
  SessionContext,
  SessionContextProps,
  TasksContext,
  TasksContextProps
} from '../TasksContext'
import { debounce } from '../../common/helpers'
import TaskTitle from '../TaskTitle/TaskTitle'
import useStyles from './TaskCardStyles'

interface TaskCardProps {
  isCompleted: boolean
  taskTitle: string
  taskId: string
  onLogout: () => void
}

const TaskCard = (props: TaskCardProps): JSX.Element => {
  const { isCompleted, taskId, taskTitle, onLogout } = props
  const [taskName, setTaskName] = useState(taskTitle)
  const [editView, setEditView] = useState(false)
  const { cardContainer } = useStyles()
  const { deleteTask, putTask } = useContext(TasksContext) as TasksContextProps
  const { token } = useContext(SessionContext) as SessionContextProps

  const handleSave = async (): Promise<void> => {
    const action = 'save'
    try {
      await putTask(taskId, token, action, taskName)
      setEditView(false)
    } catch (e) {
      if (e.message === 'Unauthorized') {
        alert(e)
        onLogout()
      } else {
        alert(e)
      }
    }
  }

  const handleComplete = async (): Promise<void> => {
    const action = 'complete'
    try {
      await putTask(taskId, token, action, taskName)
      setEditView(false)
    } catch (e) {
      if (e.message === 'Unauthorized') {
        alert(e)
        onLogout()
      } else {
        alert(e)
      }
    }
  }

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteTask(taskId, token)
    } catch (e) {
      if (e.message === 'Unauthorized') {
        alert(e)
        onLogout()
      } else {
        alert(e)
      }
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && taskName.trim().length > 0) {
      handleSave()
      setEditView(false)
    } else if (e.key === 'Escape') {
      setTaskName(taskTitle)
      setEditView(false)
    }
  }

  const handleEditViewChange = () => {
    setEditView(true)
  }

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value)
  }

  const debounceSave = debounce(handleSave, 200)
  const debounceComplete = debounce(handleComplete, 200)
  const debounceDelete = debounce(handleDelete, 200)
  const debounceKeyUp = debounce(handleKeyUp, 200)
  const disableSave = isCompleted || taskName.trim().length === 0
  const saveButtonAction = editView ? debounceSave : handleEditViewChange
  const actionType = editView ? 'save' : 'edit'
  const buttonType = editView ? (
    <Save fontSize="small" />
  ) : (
    <Edit fontSize="small" />
  )

  return (
    <div>
      <Grid xs={12} item>
        <Paper elevation={2} className={cardContainer}>
          <Checkbox
            color="primary"
            onChange={debounceComplete}
            checked={isCompleted}
            disabled={editView}
          />
          <TaskTitle
            editView={editView}
            handleKeyUp={debounceKeyUp}
            taskName={taskName}
            onChange={handleTaskNameChange}
            isCompleted={isCompleted}
          />
          <IconButton
            color="primary"
            id={actionType}
            onClick={saveButtonAction}
            disabled={disableSave}
          >
            {buttonType}
          </IconButton>
          <IconButton
            color="secondary"
            onClick={debounceDelete}
            disabled={editView}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Paper>
      </Grid>
    </div>
  )
}

export default TaskCard
