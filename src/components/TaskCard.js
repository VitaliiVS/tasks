import React from 'react'
import { debounce } from 'lodash'

class TaskCard extends React.Component {
    constructor(props) {
        super(props)

        this.handleChangeDebounced = debounce(this.handleChange.bind(this), 200)
        this.handleKeyUpDebounced = debounce(this.handleKeyUp.bind(this), 200)
        this.handleEdit = this.handleEdit.bind(this)

        this.state = {
            taskTitle: this.props.taskTitle,
            editView: false
        }
    }

    handleChange(e) {
        const classNames = e.target.className.split(' ')
        const action = classNames[0]
        this.props.onTasksChange(action, this.props.taskId, this.state.taskTitle)
        this.setState({ editView: false })
    }

    handleKeyUp(e) {
        if (e.key === 'Enter') {
            this.handleChange(e)
        } else if (e.key === 'Escape') {
            this.setState({ taskTitle: this.props.taskTitle, editView: false })
        }
    }

    handleEdit() {
        this.setState({ editView: true })
    }

    render() {
        const isCompleted = {
            true: {
                taskClassNames: "task completed",
                editButtonClassNames: "edit-button far fa-edit disabled"
            },
            false: {
                taskClassNames: "task",
                editButtonClassNames: this.state.editView ? "save-button far fa-save" : "edit-button far fa-edit"
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

        const edit = this.state.editView
        const { deleteButtonClassNames, compButtonClassNames } = editView[edit]

        const task = this.state.editView
            ? <input onKeyUp={this.handleKeyUpDebounced} value={this.state.taskTitle} onChange={(e) => this.setState({ taskTitle: e.target.value })} className="edit-view" type="text" />
            : <p className={taskClassNames}>{this.props.taskTitle}</p>

        return (
            <li className="task-container">
                <input onChange={this.handleChangeDebounced} className={compButtonClassNames} type="checkbox" checked={this.props.isCompleted} disabled={this.state.editView} />
                {task}
                <button onClick={this.state.editView ? this.handleChangeDebounced : this.handleEdit} className={editButtonClassNames} />
                <button onClick={this.handleChangeDebounced} className={deleteButtonClassNames} disabled={this.state.editView} />
            </li>
        )
    }
}

export default TaskCard