import React from 'react'
import Input from '@material-ui/core/Input'
import useStyles from './TaskTitleStyles'

interface TaskTitleProps {
  editView: boolean
  handleKeyUp: (
    e: React.KeyboardEvent<HTMLInputElement> &
      React.ChangeEvent<HTMLInputElement>
  ) => void
  taskName: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isCompleted: boolean
}

const TaskTitle = (props: TaskTitleProps): JSX.Element => {
  const { editView, handleKeyUp, taskName, onChange, isCompleted } = props
  const { title, completed, editViewStyles } = useStyles()

  const isCompletedClassNames = {
    1: {
      taskClassNames: `${title} ${completed}`
    },
    0: {
      taskClassNames: editView ? editViewStyles : title
    }
  }
  const comp = isCompleted ? 1 : 0
  const { taskClassNames } = isCompletedClassNames[comp]

  if (editView === true) {
    return (
      <Input
        onKeyUp={handleKeyUp}
        value={taskName}
        onChange={onChange}
        className={taskClassNames}
        type="text"
      />
    )
  } else {
    return <span className={taskClassNames}>{taskName}</span>
  }
}

export default TaskTitle
