const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/todo')
const { User } = require('../server/models/user')

const { ObjectID } = require('mongodb')

// var id = '59407b5e3828559af5eb5eae';
//
// if (!ObjectID.isValid(id)) {
//   return console.log(`ID ${id} not valid`)
// }

// Todo.find({
//   _id: id
// }).then( (todos) => {
//   console.log('Todos', todos)
// })
//
// Todo.findOne({
//   _id: id
// }).then( (todo) => {
//   console.log('Todo', todo)
// })

// Todo.findById(id).then( (todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   }
//   console.log('Todo', todo)
// }).catch( (e) => console.log(e) )

var id = '5937223d72c40a9b000f7c27'

User.findById(id).then( (user) => {
  if (!user) {
    return console.log('User not found')
  }
  console.log('User', user)

}).catch( (e) => console.log(e))
