import React from 'react'
import { debounce } from 'lodash'
import TaskTitle from './TaskTitle'

interface TaskCardProps {
	isCompleted: boolean
	taskTitle: string
	taskId: string
	onTasksChange: (action: string, taskId: string, taskTitle: string) => void
}

interface TaskCardState {
	taskName: string
	editView: boolean
}

class TaskCard extends React.Component<TaskCardProps, TaskCardState> {
	constructor(props: TaskCardProps) {
		super(props)

		this.state = {
			taskName: this.props.taskTitle,
			editView: false
		}
	}

	handleTaskChange = (e: any) => {
		const classNames = e.target.className.split(' ')
		const action = classNames[0]
		this.props.onTasksChange(action, this.props.taskId, this.state.taskName)
		this.setState({ editView: false })
	}

	handleKeyUp = (e: any) => {
		if (e.key === 'Enter' && this.state.taskName.trim().length > 0) {
			this.handleTaskChange(e)
		} else if (e.key === 'Escape') {
			this.setState({ taskName: this.props.taskTitle, editView: false })
		}
	}

	handleEditViewChange = () => {
		this.setState({ editView: true })
	}

	handleTaskNameChange = (e: any) => {
		this.setState({ taskName: e.target.value })
	}

	render() {
		const handleTaskChangeDebounced = debounce(this.handleTaskChange, 200)
		const handleKeyUpDebounced = debounce(this.handleKeyUp, 200)
		const { isCompleted } = this.props
		const { taskName, editView } = this.state
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
			: this.handleEditViewChange

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
					onChange={this.handleTaskNameChange}
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
}

export default TaskCard