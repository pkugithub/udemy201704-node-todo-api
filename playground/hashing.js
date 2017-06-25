const jwt = require('jsonwebtoken')

var data = {
  id: 'bob'
}

var token = jwt.sign(data, 'salty')
console.log(`token: ${token}`)

try {
  var decoded = jwt.verify(token, 'salty')
  console.log(`decoded: ${JSON.stringify(decoded)}`)
} catch (err) {
  console.log("hacker denied! " + err)
}

console.log(`decoded: ${JSON.stringify(decoded)}`)

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
