const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000
const host = 'localhost'
const session = require('express-session')
const dbOperations = require('./dbOperations')
const { connected } = require('process')


app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}))



app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.set('view engine','ejs')

 app.use(express.static(path.join(__dirname,'public')))
app.get('/register',(req,res) => {
    let AlredyExists = null
    let isEqual = null
        res.render('pages/register',{AlredyExists,isEqual})
})

app.get('/login',(req,res) => {
    let Wrong = null
    res.render('pages/login',{Wrong})
})

app.get('/',async(req,res) => {
    if(!req.session.loggedin) {
        let AlredyExists = null
        let isEqual = null
        res.render("pages/register",{AlredyExists,isEqual})
    } else {
        let firstName = req.session.firstName
        let lastName = req.session.lastName
        let name = req.session.username
        let response = await   dbOperations.getUserId(name) 
        let id = response[0].id
        let Todos = dbOperations.getTodoList(name,id) || []
        res.render('pages/main',{firstName,lastName,Todos})
    }
})

app.post('/register', async (req,res) => {
    let AlredyExists = null
    let isEqual = null
    console.log(req.body)
    let pas = req.body.password === req.body.passwordRe
    if(!pas) isEqual = false
        let result = await dbOperations.addToDb(req.body.username,req.body.password,req.body.FirstName,req.body.LastName)
        if(!result) AlredyExists = true
        if(isEqual !== null || AlredyExists !== null) res.render("pages/register",{AlredyExists,isEqual}) 
        else {
            req.session.loggedin = true
            req.session.username = req.body.username
            req.session.firstName = req.body.FirstName
            req.session.lastName = req.body.LastName
            res.render("pages/registered")
        }
})

app.post('/login',async (req,res) => {
        let result = await dbOperations.userAndPassMatch(req.body.username,req.body.password)
        if(!result) {
            let Wrong = true
        res.render("pages/login",{Wrong})
        }
        else {
            req.session.loggedin = true
            req.session.usermane = req.body.username
            let resp = await dbOperations.findPassword(req.body.username)
            req.session.firstName = resp[0].Firstname
            req.session.lastName = resp[0].Lastname
            let firstName = resp[0].Firstname
            let lastName = resp[0].Lastname
            let response = await dbOperations.getUserId(req.session.usermane) 
            let id = response[0].id
            let Todos = dbOperations.getTodoList(req.session.usermane,id) || []
            res.render('pages/main',{firstName,lastName,Todos})
        }
})

app.post('/Logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) throw err
        let Wrong = false
        res.render("pages/login",{Wrong})
    })
})

app.get('/addTodo',(req,res) => {
    let firstName = req.session.firstName
    let lastName = req.session.lastName
    res.render("pages/createList",{firstName,lastName})
})

app.post('/TitleCreate',async (req,res) => {
    let title = req.body.TodolistTitle
    let username = req.session.usermane
    await dbOperations.createTodoList(username,title)
    let firstName = req.session.firstName
    let lastName = req.session.lastName
    req.session.title = title
    let tasks =  []
    res.render("pages/createList",{firstName,lastName,title,tasks})
})

app.post('/addTask',async (req,res) => {
    let taskTitle = req.body.taskName
    let taskDescription = req.body.taskDescription
    let username = req.session.usermane
    let firstName = req.session.firstName
    let lastName = req.session.lastName
    let title = req.session.title
    await dbOperations.addTask(username,taskTitle,taskDescription,title)
    let todoList = JSON.parse((await dbOperations.getTodoList(username,title))[0].TodoObject)
    let tasks = todoList.taskList
    res.render("pages/createList",{firstName,lastName,title,tasks})
})

app.post('/RemoveTask', async (req,res) => {
    let username = req.session.usermane
    let lastName = req.session.lastName
    let firstName = req.session.firstName
    let title = req.session.title
    let index = req.body.index
    await dbOperations.removeTask(username,title,index)
    let todoList = JSON.parse((await dbOperations.getTodoList(username,title))[0].TodoObject)
    let tasks = todoList.taskList
    res.render("pages/createList",{firstName,lastName,title,tasks})
    
})



app.post('/updateTask', async (req,res) => {
    let username = req.session.usermane
    let lastName = req.session.lastName
    let firstName = req.session.firstName
    let title = req.session.title
    let newTaskTitle = req.body.taskName
    let newTaskDescription = req.body.taskDescription
    let index = req.body.index
    await dbOperations.updateTask(username,newTaskTitle,newTaskDescription,title,index)
     let todoList = JSON.parse((await dbOperations.getTodoList(username,title))[0].TodoObject)
     let tasks = todoList.taskList;
    res.render("pages/createList",{firstName,lastName,title,tasks})

})

app.post('/deleteList',async (req,res) => {
    let username = req.session.usermane
    let lastName = req.session.lastName
    let firstName = req.session.firstName
    let title = req.body.titleName
    await dbOperations.removeTodoList(username,title)
    let response = await dbOperations.getUserId(req.session.usermane) 
    let id = response[0].id
    let Todos = dbOperations.getTodoList(req.session.usermane,id) || []
    res.render('pages/main',{firstName,lastName,Todos})
})

app.post('/updateTask',async (req,res) => {
    let username = req.session.usermane
    let lastName = req.session.lastName
    let firstName = req.session.firstName
    let newTitle = req.body.TodolistTitle
    let title = req.body.title
    await dbOperations.updateTodoListName(username,title,newTitle)
    let response = await dbOperations.getUserId(req.session.usermane) 
    let id = response[0].id
    let Todos = dbOperations.getTodoList(req.session.usermane,id) || []
    res.render('pages/main',{firstName,lastName,Todos})
})

app.get(/showTodo:*/,async (req,res) => {
    
})


app.listen(PORT,host,(err) => {
    if(err) throw err
    console.log(`server is running on http://${host}:${PORT}/`)
})