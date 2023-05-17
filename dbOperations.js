const mysql = require('mysql')
const bcrypt = require('bcrypt')

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

module.exports = {
    addToDb,
    checkIfAlredyExists,
    userAndPassMatch,
    findPassword,
}