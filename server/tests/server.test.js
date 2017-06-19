const expect = require('expect')
const supertest = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../server')
const { Todo } = require('../models/todo')

const todos = [
  { _id: new ObjectID(), text: "test todo #1"},
  { _id: new ObjectID(), text: "test todo #2"},
  { _id: new ObjectID(), text: "test todo #3"},
]

beforeEach( (done) => {
  Todo.remove({}).then( () => {
    return Todo.insertMany(todos)
  }).then( () => done() )
})

describe('POST /todos', () => {
  var test_text = 'test todo text'

  it('should create a new todo', (done) => {
    supertest(app)
      .post('/todos')
      .send({text: test_text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(test_text)
      })
      .end( (err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text: test_text}).then( (todos) => {
          expect(todos.length).toBe(1)
          done()

        }).catch( (err) => {
          done(err)
        })

      })
  })

  it('should not create a new todo', (done) => {
    supertest(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end( (err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text: test_text }).then( (todos) => {
          expect(todos.length).toBe(0)
          done()
        }).catch( (err) => done(err) )
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    supertest(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(todos.length)
      })
      .end(done)

  })
})

describe('GET /todos/:id', () => {
  it('should return a todo doc', (done) => {
    supertest(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)

  })

  it('should return 404 if todo not found', (done) => {
    var id = (new ObjectID()).toHexString()

    supertest(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done)

  })

  it('should return 404 if objectID is invalid', (done) => {
    supertest(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done)

  })


})