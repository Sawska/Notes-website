const mysql = require('mysql')
const bcrypt = require('bcrypt')
const todoList = require('./TodoListClass')

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'AlexLinov',
    database:"Users"
})

connection.connect((err) => {
        if(err) throw err
        console.log('Connected')
})

  async function addToDb(username,password,firstName,lastName) {
            try {
                let res = await checkIfAlredyExists(username)
            } catch {
                return false
            }
        return new Promise((resolve,reject) => {
            bcrypt.genSalt(10,(err,salt) => {
                bcrypt.hash(password,salt,(err,hash) => {
                    connection.query(`INSERT INTO users (username,password,Firstname,Lastname)
                    VALUES('${username}','${hash}','${firstName}','${lastName}')`,(err) => {
                        if(err) throw err
                        resolve(true)
                    })
                })
            })
        })
}

 function checkIfAlredyExists(username) {
        return new Promise((resolve,reject) => {
            connection.query(`SELECT * FROM users WHERE username = '${username}'`,(err,result,fields) => {
                if(result.length !== 0) reject(true)
                resolve(false)
            })
        })

}

async function userAndPassMatch(username,password) {
        let res = await findPassword(username)
        if(res.length == 0) return false
        let pas = res[0].password
        return await bcrypt.compare(password,pas)
    
}

function findPassword(username) {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM users WHERE username = '${username}'`,(err,result,fields) => {
            if(result.length !== 0) resolve(result)
        })
    })
}


async function createTodoList(username,TodolistTitle) {
    let res = await getUserId(username) 
    let id = res[0].id
    let obj = JSON.stringify(new todoList.TodoList(TodolistTitle))
        connection.query(`INSERT INTO todoList (UserId,TodoObject,Title) VALUES(${id},'${obj}','${TodolistTitle}')`,(err,result) => {
            if(err) throw err
        })
}

 async function getUserId(username) {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT id FROM users WHERE username = '${username}'`,(err,result) => {
            if(result.length !== 0) resolve(result)
        })
    })
}

async function getTodoList(username,title) {
    let res = await getUserId(username) 
    let id = res[0].id
    return new Promise((resolve,reject) => {
        connection.query(`SELECT TodoObject FROM todoList WHERE UserId = ${id} AND Title = '${title}'`,(err,result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

async function addTask(username,taskTitle,taskDescription,Title) {
    let res = await getTodoList(username,Title)
    let TodoList = JSON.parse(res[0].TodoObject)
    let task = new todoList.Task(taskTitle,taskDescription)

    TodoList.taskList.push(task)
    // TodoList = JSON.stringify(TodoList)
    let response = await getUserId(username) 
    let id = response[0].id
    await updateTodoList(Title,id,TodoList)
}

async function updateTodoList(title,id,todoList) {
    todoList = JSON.stringify(todoList)
    return new Promise((resolve,reject) => {
        connection.query(`UPDATE todoList SET TodoObject = '${todoList}' WHERE UserId = ${id} AND Title = '${title}'`,(err,res) => {
            if(err) reject(err)
            else resolve(true)
        })
    }) 
}

async function updateTodoListName(username,Title,newName) {
    let res = await getTodoList(username,Title)
    let TodoList = JSON.parse(res[0].TodoObject)
    TodoList.title = newName
    TodoList = JSON.stringify(TodoList)
    let response = await getUserId(username) 
    let id = response[0].id
    await updateTodoList(Title,id,todoList)
}

async function removeTodoList(username,title) {
     let res = await getUserId(username) 
     let id = res[0].id
     connection.query(`DELETE from todoList WHERE UserId = ${id} AND Title = '${title}'`)
}


async function updateTask(username,newTaskTitle,newTaskDescription,Title,index) {
         let res = await getTodoList(username,Title)
    let TodoList = JSON.parse(res[0].TodoObject)
     TodoList.taskList[index].title = newTaskTitle
     TodoList.taskList[index].title = newTaskDescription
        // TodoList = JSON.stringify(TodoList)
    let response = await getUserId(username) 
    let id = response[0].id
    await updateTodoList(Title,id,TodoList)
}

async function removeTask(username,Title,index) {
    let res = await getTodoList(username,Title)
    let TodoList = JSON.parse(res[0].TodoObject)
TodoList.taskList = TodoList.taskList.filter((el,i) => i !== +index)
    // TodoList = JSON.stringify(TodoList)
    let response = await getUserId(username) 
    let id = response[0].id
    await updateTodoList(Title,id,TodoList)
}

function getTodos(id,username) {
    return new Promise((reject,resolve) => {
        connection.query(`SELECT Title from todoList WHERE UserId = ${id} AND username = '${username}'`, (err,result) => {
            if(err) reject(err)
            else resolve(result)
        })
    })
}


module.exports = {
    addToDb,
    checkIfAlredyExists,
    userAndPassMatch,
    findPassword,
    createTodoList,
    addTask,
    getTodoList,
    removeTask,
    updateTask,
    getTodoList,
    getUserId,
    removeTodoList,
    updateTodoListName,
}