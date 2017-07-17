require('./config/config.js')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todo')
var { User } = require('./models/user')
var { authenticate } = require('./middleware/authenticate')


var app = express()
const port = process.env.PORT ;

app.use(bodyParser.json())


//
app.post('/todos', authenticate, (req, res) => {
  // console.log(JSON.stringify(req, undefined, 2))
  // console.log(req.body)
  var newTodo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  newTodo.save().then( (doc) => {
    // console.log('newTodo saved: ', JSON.stringify(doc))
    res.send(doc);
  }, (err) => {
    // console.log('newTodo save failed: ',err)
    res.status(400).send(err)
  })

})

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then( (todos) => {
    res.send({todos})

  }, (err) => {
    res.status(400).send(err)

  })

})


app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id ;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(`ID ${id} not valid`)
  }

  // console.log(`id=${id}`)

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then( (todo) => {
    if (!todo) {
      return res.status(404).send('Todo not found :-(')
    }
    res.status(200).send({todo})

  }).catch( (e) => res.status(400).send(e) )

}, (err) => {
  res.status(400).send(err)
})

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id ;

  if ( ! ObjectID.isValid(id)) {
    return res.status(404).send(`ID ${id} not valid`)
  }

  // console.log(`id=${id}`)

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then( (todo) => {
    if (!todo) {
      return res.status(404).send('Todo not found :-/')
    }

    res.status(200).send({todo})

  }).catch((e) => res.status(400).send(e) )
}, (err) => {
  res.status(400).send(err)
})

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate(
    {
      _id:id,
      _creator: req.user._id
    },
    {$set: body},
    {new: true}
  ).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }

    res.send({todo})

  }).catch((e) => {
    res.status(400).send(e)
  })

}, (err) => {

})

app.post('/users', (req, res) => {

  var objectUser = _.pick(req.body, ['email', 'password'])

  var newUser = new User(objectUser)

  newUser.save().then( () => {
    // console.log('newUser saved: ', JSON.stringify(newUser))

    return newUser.generateAuthToken() ;
  }).then( (token) => {
    res.header({'x-auth': token }).send(newUser)

  }).catch((err) => {
    // console.log('newUser save failed: ',err)
    res.status(400).send(err)
  })
})

app.post('/users/login', (req, res) => {
  var objectUser = _.pick(req.body, ['email', 'password']);

  User.findByCredentials( objectUser.email, objectUser.password ).then( (user) => {
    return user.generateAuthToken().then( (token) => {
      res.header('x-auth', token).send(user);
    })

  }).catch((e) => {
    res.status(400).send(e);

  })

})


app.get('/users/me', authenticate, (req, res) => {
  // console.log("debug2> req.token", req.token)
  res.send(req.user)
})

app.delete('/users/me/token', authenticate, (req,res) => {
  req.user.removeToken(req.token).then( () => {
    res.status(200).send('logout succeeded')
  }, () => {
    res.status(400).send('logout failed');
  });
});

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
