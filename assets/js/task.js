export class Task {
    constructor(id, userId, input) {
        this.taskId = id
        this.createdBy = userId
        this.taskLabel = input
        this.isCompleted = false
        this.isDeleted = false
    }
}