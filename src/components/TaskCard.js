import React from 'react'

class TaskCard extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)

        this.state = {
            taskTitle: this.props.taskTitle
        }
    }

    handleChange(e) {
        const classes = e.target.className.split(' ')
        const button = classes[0]
        this.props.onTasksChange(this.props.taskId, button, this.state.taskTitle)
    }

    render() {
        const isCompleted = {
            true: {
                taskClasses: "task completed",
                editButton: "edit-button far fa-edit disabled"
            },
            false: {
                taskClasses: "task",
                editButton: this.props.editView ? "save-button far fa-save" : "edit-button far fa-edit"
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
        const { taskClasses, editButton } = isCompleted[completed]

        const edit = this.props.editView
        const { deleteButtonClassNames, compButtonClassNames } = editView[edit]

        const task = this.props.editView
            ? <input value={this.state.taskTitle} onChange={(e) => this.setState({ taskTitle: e.target.value })} className="edit-view" type="text" />
            : <p className={taskClasses}>{this.props.taskTitle}</p>

        return (
            <li className="task-container">
                <input onChange={this.handleChange} className={compButtonClassNames} type="checkbox" defaultChecked={this.props.isCompleted} disabled={this.props.editView} />
                {task}
                <button onClick={this.handleChange} className={editButton} />
                <button onClick={this.handleChange} className={deleteButtonClassNames} disabled={this.props.editView} />
            </li>
        )
    }
}

export default TaskCard