// const MongoClient = require('mongodb').MongoClient ;

const { MongoClient, ObjectID } = require('mongodb') ;

// var obj = new ObjectID()
// console.log('obj=',obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to db ' + err)
  }
  console.log('Connected to db!')

  // // deleteMany
  // db.collection('Todos').deleteMany( { text: 'Something to do 3'}).then( (result) => {
  //   console.log('deleteMany:', result.result)
  // })
  //
  // // deleteOne
  // db.collection('Todos').deleteOne( { text: 'Something to do 2'}).then( (result) => {
  //   console.log('deleteOne:', result.result)
  // })

  // // findOneAndDelete
  // db.collection('Todos').findOneAndDelete( { completed: false } ).then( (result) => {
  //   console.log('findOneAndDelete:', result)
  // })



  // // deleteMany
  // db.collection('Users').deleteMany( { name: 'Pei'}).then( (result) => {
  //   console.log('deleteMany:', result.result)
  // })

  // findOneAndDelete
  db.collection('Users').findOneAndDelete( { _id: new ObjectID('593436e31c057e10d0ec0fbf') } ).then( (result) => {
    console.log('findOneAndDelete:', result)
  })

  // db.close() // might be a problem?
})
