var env = process.env.NODE_ENV || 'development'
console.log('env ********************* ',env)
if (env === 'development'){
    process.env.port = 3000
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todos'
}else if (env === 'test') {
    process.env.port = 3000 
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoTest'
}

var express = require('express')
const bodyParser  = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID} = require('./db/mongoose')
const {lodash} = require('lodash')

var app  = express()

var port = process.env.PORT || 3000

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://bhu078:V38jdh79s9@cluster0-jnumx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

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

app.listen(port, ()=>{

    console.log(`started on port  ${port}`)
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