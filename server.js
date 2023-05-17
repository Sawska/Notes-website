const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000
const host = 'localhost'
const session = require('express-session')
const dbOperations = require('./dbOperations')


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

app.get('/',(req,res) => {
    if(!req.session.loggedin) {
        let AlredyExists = null
        let isEqual = null
        res.render("pages/register",{AlredyExists,isEqual})
    } else {
        let firstName = req.session.firstName
        let lastName = req.session.lastName
        let Todos = []
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
            let Todos = []
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

app.post('/TitleCreate',(req,res) => {
    let addToDb = true
    let firstName = req.session.firstName
    let lastName = req.session.lastName
    res.render("pages/createList",{firstName,lastName})
})

app.listen(PORT,host,(err) => {
    if(err) throw err
    console.log(`server is running on http://${host}:${PORT}/`)
})