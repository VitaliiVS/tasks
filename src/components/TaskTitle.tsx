import React from 'react'

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
      <input
        onKeyUp={handleKeyUp}
        value={taskName}
        onChange={onChange}
        className={classNames}
        type="text"
      />
    )
  } else {
    return <p className={classNames}>{taskName}</p>
  }
}

export default TaskTitle
