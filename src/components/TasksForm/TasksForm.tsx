import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core'

import TaskCard from '../TaskCard/TaskCard'
import {
  SessionContext,
  SessionContextProps,
  TasksContext,
  TasksContextProps
} from '../TasksContext'
import { Task } from '../../common/task'
import { debounce } from '../../common/helpers'
import useStyles from './TasksFormStyles'
import { Add } from '@material-ui/icons'

const TasksForm = (): JSX.Element => {
  const [taskTitle, setTaskTitle] = useState('')
  const [disabled, setDisabled] = useState(true)
  const { tasks, getTasks, postTask } = useContext(
    TasksContext
  ) as TasksContextProps
  const { token, setToken } = useContext(SessionContext) as SessionContextProps
  const { tasksHeader, logoutButtonStyles } = useStyles()

  useEffect(() => {
    const fetch = async () => {
      try {
        await getTasks(token)
      } catch (e) {
        if (e.message === 'Unauthorized') {
          alert(e)
          handleLogout()
        } else {
          alert(e)
        }
      }
    }
    fetch()
  }, [])

  const handleLogout = () => {
    document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
    setToken('')
  }

  const handleAddTask = async (): Promise<void> => {
    if (taskTitle.trim() !== '') {
      try {
        await postTask(taskTitle, token)
        setTaskTitle('')
        setDisabled(true)
      } catch (e) {
        if (e.message === 'Unauthorized') {
          alert(e)
          handleLogout()
        } else {
          alert(e)
        }
      }
    }
  }

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value)
    setDisabled(taskTitle.trim().length === 0)
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTaskDebounced()
    }
  }

  const handleAddTaskDebounced = debounce(handleAddTask, 200)

  return (
    <div>
      <Grid alignItems="center" justify="flex-end" container direction="row">
        <Grid item xs={11}>
          <Typography className={tasksHeader} variant="h3" component="h1">
            Tasks
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            className={logoutButtonStyles}
          >
            Log out
          </Button>
        </Grid>
      </Grid>
      <Grid alignItems="center" justify="center" container spacing={4}>
        <Grid item xs={3}>
          <TextField variant="outlined" />
        </Grid>
        <Grid item xs={1}>
          <IconButton color="primary">
            <Add fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    </div>

    // <div>
    //   <h1 className="header">Tasks</h1>
    //   <button onClick={handleLogout} className={'logout-button button'}>
    //     Log out
    //   </button>
    //   <div className="container">
    //     <input
    //       value={taskTitle}
    //       onChange={handleTaskNameChange}
    //       onKeyUp={handleKeyUp}
    //       className="task-input"
    //       placeholder="What you want to do?"
    //     />
    //     <button
    //       onClick={handleAddTaskDebounced}
    //       className="create-button far fa-plus-square button"
    //       disabled={disabled}
    //     />
    //     <ul className="tasks-list">
    //       {tasks.map((task: Task) => (
    //         <TaskCard
    //           onLogout={handleLogout}
    //           isCompleted={task.isCompleted}
    //           key={task.taskId}
    //           taskId={task.taskId}
    //           taskTitle={task.taskLabel}
    //         />
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  )
}

export default TasksForm
