const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value)
      },
      message: '{VALUE} is not a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
})

UserSchema.methods.toJSON = function () {
  var user = this ;

  var userObject = user.toObject()

  return _.pick(userObject, [ '_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
  var user = this ;

  var access = 'auth' ;
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'salty').toString() ;

  user.tokens.push({ access, token})

  return user.save().then( () => {
    return token
  })
}

UserSchema.statics.findByToken = function (token) {
  var User = this
  var decoded ;

  try {
    decoded = jwt.verify(token, 'salty')
  } catch (e) {
    // return new Promise( (resolve, reject) => {
    //   return reject();
    // })
    return Promise.reject('barf')

  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })

}

UserSchema.statics.findByCredentials = function ( email, password ) {
  var User = this;

  return User.findOne({email}).then( (user) => {
    if (!user) {
      return Promise.reject("invalid email");
    }

    return new Promise( ( resolve, reject ) => {
      bcrypt.compare(password, user.password, (err, result) => {
        // console.log('err:', err, ' result:' , result)
        if (err) {
          reject(err);
        } else {
          if (result) {
            resolve(user);
          } else {
            reject("invalid password")
          }
        }

      })
    })

  });


}

UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      // console.log('salt:', salt)
      bcrypt.hash(user.password, salt, (err, hash) => {
        // console.log('hash:', hash)
        user.password = hash ;

        next();
      })
    })

  } else {
    next();
  }
})

var User = mongoose.model('User', UserSchema )

module.exports = { User }
