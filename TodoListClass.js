class TodoList {
    constructor(Title) {
        this.title = Title
        this.taskList = []
    }
}


class Task {
    constructor(title,description) {
        this.title = title || ''
        this.description =  description || ''
        this.checked = false
    }
}

module.exports = {
    TodoList,
    Task
}