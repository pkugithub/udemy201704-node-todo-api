const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id ;

  if ( ! ObjectID.isValid(id)) {
    return res.status(404).send(`ID ${id} not valid`)
  }

  console.log(`id=${id}`)

  Todo.findByIdAndRemove(id).then( (todo) => {
    if (!todo) {
      return res.status(404).send('Todo not found :-/')
    }

    res.status(200).send({todo})

  }).catch((e) => res.status(400).send(e) )
}, (err) => {
  res.status(400).send(err)
})

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id ;

  var body = _.pick(req.body, ['text', 'completed'])

  if ( ! ObjectID.isValid(id)) {
    return res.status(404).send(`ID ${id} not valid`)
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()

  } else {
    body.completed = false
    body.completedAt = null ;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }

    res.send({todo})

  }).catch((e) => {
    res.status(400).send(e)
  })

}, (err) => {

})



//
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
