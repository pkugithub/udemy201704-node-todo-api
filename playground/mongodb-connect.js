// const MongoClient = require('mongodb').MongoClient ;

const { MongoClient, ObjectID } = require('mongodb') ;

var obj = new ObjectID()
console.log('obj=',obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to db ' + err)
  }

  console.log('Connected to db!')

  // db.collection('Todos').insertOne({
  //   text: 'Something to do 3',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('insertOne failed ' + err)
  //   }
  //
  //   console.log('insetOne succeed! ' + JSON.stringify(result.ops, undefined, 2))
  //
  // })

  db.collection('Users').insertOne({
    name: 'Pei',
    age: 99,
    location: 'Pacifica'
  }, (err, result) => {
    if (err) {
      return console.log('insertOne failed ' + err)
    }

    console.log('insetOne succeed! ' + JSON.stringify(result.ops, undefined, 2))

  })

  db.close()
})
