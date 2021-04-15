import React from 'react'

interface TaskTitleProps {
	editView: boolean
	handleKeyUp: (e: any) => void
	taskName: string
	onChange: (e: any) => void
	classNames: string
}

class TaskTitle extends React.Component<TaskTitleProps> {
	render() {
		const {
			editView,
			handleKeyUp,
			taskName,
			onChange,
			classNames
		} = this.props

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
}

export default TaskTitle
