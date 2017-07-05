const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var password = '123abdXX'

// bcrypt.genSalt(10, (err, salt) => {
//     console.log('salt:', salt)
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log('hash:', hash)
//   })
// })

hashedPassword = '$2a$10$mKRsDchCBlV1K/Fkgc2gJOEsYVDiev187tLZEbq0Pjvns6J2q9hOW'

bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log('result:' , result)
})

// var data = {
//   id: 'bob'
// }
//
// var token = jwt.sign(data, 'salty')
// console.log(`token: ${token}`)
//
// try {
//   var decoded = jwt.verify(token, 'salty')
//   console.log(`decoded: ${JSON.stringify(decoded)}`)
// } catch (err) {
//   console.log("hacker denied! " + err)
// }
//
// console.log(`decoded: ${JSON.stringify(decoded)}`)

// const { SHA256 } = require('crypto-js')
//
// var message = 'to be or not to be'
//
// var hash = SHA256(message).toString() ;
// var hash2 = SHA256(hash).toString() ;
//
//
// console.log(`hash : ${hash}`)
// console.log(`hash2: ${hash2}`)
//
// var data = {
//   id: 'bob'
// }
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data)+'salty').toString()
// }
//
// console.log(`token: ${JSON.stringify(token)}`)
