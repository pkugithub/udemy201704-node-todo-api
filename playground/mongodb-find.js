// const MongoClient = require('mongodb').MongoClient ;

const { MongoClient, ObjectID } = require('mongodb') ;

// var obj = new ObjectID()
// console.log('obj=',obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to db ' + err)
  }

  console.log('Connected to db!')

  // db.collection('Todos').find({completed: false}).toArray().then( (docs) => {
  //   console.log('docs fetched:')
  //   console.log(JSON.stringify(docs, undefined, 2))
  //
  // }, (err) => {
  //   console.log('Unable to fetch todos:', err)
  // })

  // db.collection('Todos').find().count().then( (cnt) => {
  //   console.log('docs count:' , cnt)
  //
  // }, (err) => {
  //   console.log('Unable to count todos:', err)
  // })

  db.collection('Users').find({name: 'Katie'}).toArray().then( (docs) => {
    console.log('docs fetched:')
    console.log(JSON.stringify(docs, undefined, 2))

    db.close()

  }, (err) => {
    console.log('Unable to fetch docs:', err)
  })

  // db.close() // might be a problem?
})
