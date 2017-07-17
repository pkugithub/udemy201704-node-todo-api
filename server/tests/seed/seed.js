
const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')


const { Todo } = require('../../models/todo')
const { User } = require('../../models/user')

var userOneId = new ObjectID()
var userTwoId = new ObjectID()

const users = [{
  _id: userOneId,
  email: 'test1@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},{
  _id: userTwoId,
  email: 'test2@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const todos = [
  {
    _id: new ObjectID(),
    text: "test todo #1",
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: "test todo #2",
    completed: true,
    completedAT: 22 ,
    _creator: userTwoId
  },
  {
    _id: new ObjectID(),
    text: "test todo #3",
    _creator: userTwoId
  },
]

const populateToDos = (done) => {
  Todo.remove({}).then( () => {
    return Todo.insertMany(todos)
  }).then( () => done() )
}

const populateUsers = (done) => {
  User.remove({}).then( () => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then( () => done() )
}

module.exports = { todos, populateToDos, users, populateUsers }
