var express = require('express')
const bodyParser  = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID} = require('./db/mongoose')
const {lodash} = require('lodash')

var app  = express()

 


app.use(bodyParser.json())

app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text : req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos}) 
    }).catch((err)=>{
        res.status(400).send(err)
    })
})


app.get('/todos/:id',(req,res)=>{
    var id = req.params.id 

    if(!ObjectID.isValid(id)) return res.status(400).send()

    Todo.findById(id).then((todo)=>{
        if(!todo) return res.status(404).send()
        res.send({todo})

    }).catch((err)=>{
        res.status(400).send()
    })
})

app.delete('/todos/:id', (req,res)=>{
    var id =req.params.id
    if (!ObjectID.isValid(id)) return res.status(400).send({err:'invalid id'})

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo) return res.status(404).send()
        res.send({todo})
    }).catch((err)=>{
        res.status(400).send(); 
    })


})

app.patch('/todos/:id',(req,res)=>{
        var id  = req.params.id 
        var body = _.pick(req.body, ['text','completed'])
        if (!ObjectID.isValid(id)) return res.status(400).send({err:'invalid id'})

        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime()
        }else{
            body.completed = false
            body.completedAt = null 
        }

        Todo.findByIdAndUpdate(id,
            {$set:body}, {new:true} ).then((todo)=>{
                if(!todo) return res.status(404).send()
                res.send({todo})
                
                }).catch((err)=>{
                    res.status(400).send()  
                })

    })

app.listen(3000, ()=>{

    console.log('started on port 3000')
})


module.exports ={
    app
}

// newTodo.save().then((result) =>{
//         console.log('saved ', result)
// }).catch((err) =>{
//     console.log('Unable to save ',err)
// })





// var newUser = new User({
//     email: "whtitefall@gmail.com"

// })


// newUser.save().then((result)=> {
//     console.log('saved' ,result)
// }).catch((err)=>{

//     console.log('unable to save',err)
// })