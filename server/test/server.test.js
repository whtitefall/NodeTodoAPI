const expect = require('expect')
const request = require('supertest')
var {ObjectID} = require('./db/mongoose')

const {app} = require('../server')

const {Todo} = require('../models/todo')

const todos = [
    {
        _id: new ObjectID(), 
        text: '1st'
    },
    {
        _id: new ObjectID(), 
        text: '2nd'

    }

]


beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos)
    }).then(()=>done())
})

describe('POST /todos', ()=>{
    it('should create a new todo ',(done)=>{
        var text = 'Tetsing to do route'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)
            })

            .end((err,res)=>{
                if (err) return done(err) ; 
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((err)=>{
                    done(err)
                })
            })

    }) 
    
    it('should not creat todo with invalid nody data', (done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err) return done(err)
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2)
                    done()
                }).catch((err)=>{
                    done(err)
                })
            })

    })  


    


})

describe('Get /todo', () =>{
    it('should get all todos ', (done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2)
            })
            .end(done); 

    } )
})


describe('GET /todos/:id', ()=>{
    it('should return  todo by doc id ',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text)
            })

            .end(done)
    })


    it('should return 404 if todo is not found',(done)=>{
        var hexID = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .end(done)
    })


    it('should return 404 for non-object ids', (done)=>{
        request(app)
            .get('/todos/123abc')
            .expect(400)
            .end(done)
    })

})

describe('DELETE /todos/:id', () => {
    
    it('should remove a todo',(done)=>{

        var hexID = todos[1]._id.toHexString()

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexID)
            })
            .end((err,res)=>{
                if(err) return done(err)
                Todo.findById(hexID).then((todo)=>{
                    expect(todo).toBeNull()
                    done()
                }).catch((err)=>{
                    done(err)
                })
            })
    })

    it('should return 404 if todo not found',(done)=>{
        var hexID = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404) 
            .end(done)
    })
    it('should return 400 if test id is invalid',(done)=>{
        request(app)
        .delete('/todos/123abc')
        .expect(400)
        .end(done)
    })
})


describe('PATCH /todos/:id', () => {
    it('should update the todo',()=>{
        var hexID = todos[0]._id.toHexString()
        var text = "This should be the new text"

        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                completed: true , 
                text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(true)
                expect(typeof parseInt( res.body.todo.completedAt)).toBe('number')
            })
            .end(done)

    })

    it('should clear completeAt when todo is not completed',()=>{
        var hexID = todos[0]._id.toHexString()
        var text = "This should be the new text"

        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                completed: false , 
                text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(false)
                expect(typeof parseInt( res.body.todo.completedAt)).toBe('number')
            })
            .end(done)

    })
    
})
