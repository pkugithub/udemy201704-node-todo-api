// const MongoClient = require('mongodb').MongoClient ;

const { MongoClient, ObjectID } = require('mongodb') ;

// var obj = new ObjectID()
// console.log('obj=',obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to db ' + err)
  }
  console.log('Connected to db!')

  // db.collection('Todos').findOneAndUpdate( {
  //   _id : new ObjectID("5935e0a21c057e10d0ec0fcb")
  // }, {
  //   $set: { completed: true }
  // }, {
  //   returnOriginal: false
  // }).then( (result) => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate( {
    _id : new ObjectID("5935e1f1b714a04cf63dbf71")
  }, {
    $set: { name: 'Nainai' },
    $inc: { age: 1 }
  }, {
    returnOriginal: false
  }).then( (result) => {
    console.log(result)
  })

  // db.close() // might be a problem?
})
