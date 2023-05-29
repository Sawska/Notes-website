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
    return new Promise((resolve,reject) => {
        connection.query(`INSERT INTO todoList (UserId,TodoObject,Title) VALUES(${id},'${obj}','${TodolistTitle}')`,(err,result,fields) => {
            if(err) reject(err)
            else resolve(result.insertId)
        })
    })
}

 async function getUserId(username) {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT id FROM users WHERE username = '${username}'`,(err,result) => {
            if(err) throw err
            if(result.length !== 0) resolve(result)
        })
    })
}

async function getTodoList(username,title,listId) {
    let res = await getUserId(username) 
    let id = res[0].id
    return new Promise((resolve,reject) => {
        connection.query(`SELECT TodoObject FROM todoList WHERE UserId = ${id} AND Title = '${title}' AND ListId = ${listId}`,(err,result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

async function addTask(username,taskTitle,taskDescription,Title,listId) {
    let res = await getTodoList(username,Title,listId)
    let TodoList = JSON.parse(res[0].TodoObject)
    let task = new todoList.Task(taskTitle,taskDescription)

    TodoList.taskList.push(task)
    let response = await getUserId(username) 
    let id = response[0].id
    await updateTodoList(Title,id,TodoList,listId)
}

async function updateTodoList(title,id,todoList,ListId) {
    let newTitle = todoList.title
    todoList = JSON.stringify(todoList)
    return new Promise((resolve,reject) => {
        connection.query(`UPDATE todoList SET TodoObject = '${todoList}', Title = '${newTitle}'  WHERE UserId = ${id} AND Title = '${title}' AND ListId = ${ListId}`,(err,res) => {
            if(err) reject(err)
            else resolve(true)
        })
    }) 
}

async function updateTodoListName(username,Title,newName,listId) {
    let res = await getTodoList(username,Title,listId)
    let TodoList = JSON.parse(res[0].TodoObject)
    TodoList.title = newName
    let response = await getUserId(username) 
    let id = response[0].id
    await updateTodoList(Title,id,TodoList,listId)
}

async function removeTodoList(username,title,ListId) {
     let res = await getUserId(username) 
     let id = res[0].id
     return new Promise((resolve,reject) => {
        connection.query(`DELETE from todoList WHERE UserId = ${id} AND Title = '${title}' AND ListId = ${ListId}`,(err,res) => {
            if(err) reject(err)
            else resolve(true)
        })
     })
}   


async function updateTask(username,newTaskTitle,newTaskDescription,Title,index,listId) {
         let res = await getTodoList(username,Title,listId)
    let TodoList = JSON.parse(res[0].TodoObject)
     TodoList.taskList[index].title = newTaskTitle
     TodoList.taskList[index].title = newTaskDescription
    let response = await getUserId(username) 
    let id = response[0].id
    await updateTodoList(Title,id,TodoList,listId)
}

async function removeTask(username,Title,index,listId) {
    let res = await getTodoList(username,Title,listId)
    let TodoList = JSON.parse(res[0].TodoObject)
TodoList.taskList = TodoList.taskList.filter((el,i) => i !== +index)
    let response = await getUserId(username) 
    let id = response[0].id
    await updateTodoList(Title,id,TodoList,listId)
}

function getTodos(id) {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT TodoObject FROM todoList WHERE UserId = ${id}`, (err,result) => {
            if(err)  reject(err)
            resolve(result)
        })
    })
}

async function updateCrossValue(username,Title,check,listId) {
    let res = await getTodoList(username,Title,listId)
    let TodoList = JSON.parse(res[0].TodoObject)
    for(let i = 0;i<TodoList.taskList.length;i++) {
        if(check[i] == undefined) continue
        else TodoList.taskList[i].checked = check[i]
    }
    let response = await getUserId(username) 
    let id = response[0].id
    console.log(TodoList.taskList[0].checked)
    await updateTodoList(Title,id,TodoList,listId)
}

function getListId(id) {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT ListId FROM todoList WHERE UserId = ${id}`,(err,result) => {
            if(err) reject(err)
            resolve(result)
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
    getTodos,
    updateCrossValue,
    getListId
}