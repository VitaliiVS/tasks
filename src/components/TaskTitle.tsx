import React from 'react'
import Input from '@material-ui/core/Input'

interface TaskTitleProps {
  editView: boolean
  handleKeyUp: (
    e: React.KeyboardEvent<HTMLInputElement> &
      React.ChangeEvent<HTMLInputElement>
  ) => void
  taskName: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  classNames: string
}

const TaskTitle = (props: TaskTitleProps): JSX.Element => {
  const { editView, handleKeyUp, taskName, onChange, classNames } = props

  if (editView === true) {
    return (
      <Input
        onKeyUp={handleKeyUp}
        value={taskName}
        onChange={onChange}
        className={classNames}
        type="text"
      />
    )
  } else {
    return <span className={classNames}>{taskName}</span>
  }
}

export default TaskTitle
