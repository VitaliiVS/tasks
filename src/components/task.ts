export class Task {
  taskId: string
  taskLabel: string
  isCompleted: boolean
  isDeleted: boolean

  constructor(id: string, input: string) {
    this.taskId = id
    this.taskLabel = input
    this.isCompleted = false
    this.isDeleted = false
  }
}
