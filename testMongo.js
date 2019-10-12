const MongoClient = require('mongodb').MongoClient; 

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true}, (err,client) =>{
    if (err) return console.log('unable to connect mongo ')

    console.log('connect to mongo db ')
    

    const db = client.db('TodoApp'); 

    db.collection('Todos').insertOne({
        text:"something to do ", 
        complete: false
    }, (err,result) => {
        if(err) return console.log('unable to add todo')
        
        console.log(JSON.stringify(result.ops,undefined,2))
    })

    client.close()

})