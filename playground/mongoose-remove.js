const { mongoose } = require('../server/db/mongoose')
const { Todo } = require('../server/models/todo')
const { User } = require('../server/models/user')

const { ObjectID } = require('mongodb')

// Todo.remove({}).then( (result) => {
//   console.log(result);
// })

// Todo.findOneAndRemove( { _id: })

Todo.findByIdAndRemove( '5949793e0d8560ceab897b89' ).then( (todo) => {
  console.log(todo);


})
