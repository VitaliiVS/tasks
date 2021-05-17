import React, { useState } from 'react'
import { debounce } from '../common/helpers'
import TaskTitle from './TaskTitle'

interface TaskCardProps {
  isCompleted: boolean
  taskTitle: string
  taskId: string
  onTasksChange: (action: string, taskId: string, taskTitle: string) => void
}

const TaskCard = (props: TaskCardProps): JSX.Element => {
  const [taskName, setTaskName] = useState(props.taskTitle)
  const [editView, setEditView] = useState(false)

  const handleTaskChange = (e: React.BaseSyntheticEvent) => {
    const { taskId, onTasksChange } = props
    const classNames = e.target.className.split(' ')
    const action = classNames[0]

    onTasksChange(action, taskId, taskName)
    setEditView(false)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { taskTitle } = props

    if (e.key === 'Enter' && taskName.trim().length > 0) {
      handleTaskChange(e)
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

  const handleTaskChangeDebounced = debounce(handleTaskChange, 200)
  const handleKeyUpDebounced = debounce(handleKeyUp, 200)

  const { isCompleted } = props
  const isCompletedClassNames = {
    1: {
      taskClassNames: 'task completed',
      editButtonClassNames: 'edit-button far fa-edit'
    },
    0: {
      taskClassNames: editView ? 'edit-view' : 'task',
      editButtonClassNames: editView
        ? 'save-button far fa-save'
        : 'edit-button far fa-edit'
    }
  }
  const completed = isCompleted ? 1 : 0
  const { taskClassNames, editButtonClassNames } = isCompletedClassNames[
    completed
  ]
  const disableSave = isCompleted || taskName.trim().length === 0
  const saveButtonAction = editView
    ? handleTaskChangeDebounced
    : handleEditViewChange

  return (
    <li className="task-container">
      <input
        onChange={handleTaskChangeDebounced}
        className="comp-button"
        type="checkbox"
        checked={isCompleted}
        disabled={editView}
      />
      <TaskTitle
        editView={editView}
        handleKeyUp={handleKeyUpDebounced}
        taskName={taskName}
        onChange={handleTaskNameChange}
        classNames={taskClassNames}
      />
      <button
        onClick={saveButtonAction}
        className={editButtonClassNames}
        disabled={disableSave}
      />
      <button
        onClick={handleTaskChangeDebounced}
        className="delete-button far fa-trash-alt"
        disabled={editView}
      />
    </li>
  )
}

export default TaskCard
