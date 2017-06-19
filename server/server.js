
var express = require('express')
var bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo')
var { User } = require('./models/user')


var app = express()
const port = process.env.PORT || 3000 ;

app.use(bodyParser.json())



app.post('/todos', (req, res) => {
  // console.log(JSON.stringify(req, undefined, 2))
  // console.log(req.body)
  var newTodo = new Todo({
    text: req.body.text
  })

  newTodo.save().then( (doc) => {
    console.log('newTodo saved: ', JSON.stringify(doc))
    res.send(doc);
  }, (err) => {
    console.log('newTodo save failed: ',err)
    res.status(400).send(err)
  })

})

app.get('/todos', (req, res) => {
  Todo.find().then( (todos) => {
    res.send({todos})

  }, (err) => {
    res.status(400).send(err)

  })

})


app.get('/todos/:id', (req, res) => {
  var id = req.params.id ;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(`ID ${id} not valid`)
  }

  console.log(`id=${id}`)

  Todo.findById(id).then( (todo) => {
    if (!todo) {
      return res.status(404).send('Todo not found :-(')
    }
    res.status(200).send({todo})

  }).catch( (e) => res.status(400).send(e) )

}, (err) => {
  res.status(400).send(err)
})

app.listen(port , () => {
  console.log(`started on port ${port}`)
})

module.exports = { app }

// var d = new Date();
// var seconds = Math.round(d.getTime() / 1000);
//
// var newTodo = new Todo({
//   text: '     blow _ job      '
// })
//
// newTodo.save().then((doc) => {
//   console.log('saved doc:', JSON.stringify( doc, undefined, 2))
// }, (e) => {
//   console.log('save failed: ', e)
// })

// var newUser = new User({
//   email: '  katie@aol.com   '
//
// })
//
// newUser.save().then( (doc) => {
//   console.log('saved doc:', JSON.stringify( doc, undefined, 2))
// }, (error) => {
//   console.log('save failed: ', error)
// })
