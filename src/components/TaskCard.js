import React from 'react'

class TaskCard extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)

        this.state = {
            taskTitle: this.props.taskTitle
        }
    }

    handleChange(e) {
        const classNames = e.target.className.split(' ')
        const action = classNames[0]
        this.props.onTasksChange(action, this.props.taskId, this.state.taskTitle)
    }

    handleKeyUp(e) {
        if (e.key === 'Enter') {
            this.handleChange(e)
        } else if (e.key === 'Escape') {
            const action = 'cancel'
            this.props.onTasksChange(action)
            this.setState({ taskTitle: this.props.taskTitle })
        }
    }

    render() {
        const isCompleted = {
            true: {
                taskClassNames: "task completed",
                editButtonClassNames: "edit-button far fa-edit disabled"
            },
            false: {
                taskClassNames: "task",
                editButtonClassNames: this.props.editView ? "save-button far fa-save" : "edit-button far fa-edit"
            }
        }

        const editView = {
            true: {
                deleteButtonClassNames: "delete-button far fa-trash-alt disabled",
                compButtonClassNames: "comp-button disabled"
            },
            false: {
                deleteButtonClassNames: "delete-button far fa-trash-alt",
                compButtonClassNames: "comp-button"
            }
        }

        const completed = this.props.isCompleted
        const { taskClassNames, editButtonClassNames } = isCompleted[completed]

        const edit = this.props.editView
        const { deleteButtonClassNames, compButtonClassNames } = editView[edit]

        const task = this.props.editView
            ? <input onKeyUp={this.handleKeyUp} value={this.state.taskTitle} onChange={(e) => this.setState({ taskTitle: e.target.value })} className="edit-view" type="text" />
            : <p className={taskClassNames}>{this.props.taskTitle}</p>

        return (
            <li className="task-container">
                <input onChange={this.handleChange} className={compButtonClassNames} type="checkbox" defaultChecked={this.props.isCompleted} disabled={this.props.editView} />
                {task}
                <button onClick={this.handleChange} className={editButtonClassNames} />
                <button onClick={this.handleChange} className={deleteButtonClassNames} disabled={this.props.editView} />
            </li>
        )
    }
}

export default TaskCard