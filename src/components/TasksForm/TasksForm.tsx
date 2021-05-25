import React, { useContext, useEffect, useState } from 'react'
import { Button, Grid, TextField, Typography } from '@material-ui/core'

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
  const { tasksHeader, logoutButton, taskInput } = useStyles()

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
      <Grid item xs>
        <Grid alignItems="center" justify="flex-end" container direction="row">
          <Grid item xs>
            <Typography className={tasksHeader} variant="h3" component="h1">
              Tasks
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              className={logoutButton}
            >
              Log out
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ marginTop: '50px' }}
      >
        <Grid item xs>
          <Grid container spacing={5}>
            <Grid item xs>
              <TextField
                className={taskInput}
                value={taskTitle}
                onChange={handleTaskNameChange}
                onKeyUp={handleKeyUp}
                placeholder="What you want to do?"
              />
            </Grid>
            <Grid item xs>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTaskDebounced}
                disabled={disabled}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid
            direction="column"
            justify="center"
            alignItems="center"
            container
            spacing={3}
            style={{ marginTop: '50px' }}
          >
            {tasks.map((task: Task) => (
              <TaskCard
                onLogout={handleLogout}
                isCompleted={task.isCompleted}
                key={task.taskId}
                taskId={task.taskId}
                taskTitle={task.taskLabel}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default TasksForm
