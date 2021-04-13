import React from 'react'

class TaskTitle extends React.Component {

    render() {
        const {editView, handleKeyUp, taskName, onChange, classNames} = this.props

        if (editView === true) {
            return <input onKeyUp={handleKeyUp} value={taskName} onChange={onChange} className={classNames} type="text" />
        } else {
            return <p className={classNames}>{taskName}</p>
        }
    }
}

export default TaskTitle