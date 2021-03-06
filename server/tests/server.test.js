const expect = require('expect')
const supertest = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../server')
const { Todo } = require('../models/todo')
const { User } = require('../models/user')

const { todos, populateToDos,  users, populateUsers } = require('./seed/seed')

beforeEach( populateToDos )

beforeEach( populateUsers )

// if (false) { // skip these tests ...

describe('POST /todos', () => {
  var test_text = 'test todo text'

  it('should create a new todo', (done) => {
    supertest(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token )
      .send({text: test_text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(test_text)
      })
      .end( (err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text: test_text}).then( (todos) => {
          expect(todos.length).toBe(1)
          done()

        }).catch( (err) => {
          done(err)
        })

      })
  })

  it('should not create a new todo', (done) => {
    supertest(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token )
      .send({})
      .expect(400)
      .end( (err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text: test_text }).then( (todos) => {
          expect(todos.length).toBe(0)
          done()
        }).catch( (err) => done(err) )
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    supertest(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token )
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1)
      })
      .end(done)

  })
})

describe('GET /todos/:id', () => {
  it('should return a todo doc', (done) => {
    supertest(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token )
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)

  });

  it('should not return a todo doc created by other users', (done) => {
    supertest(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token )
      .expect(404)
      .end(done)

  });

  it('should return 404 if todo not found', (done) => {
    var id = (new ObjectID()).toHexString()

    supertest(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token )
      .expect(404)
      .end(done)

  })

  it('should return 404 if objectID is invalid', (done) => {
    supertest(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token )
      .expect(404)
      .end(done)

  })
})

describe('DELETE /todos/:id', () => {
  it('should delete a todo doc', (done) => {
    var hexId = todos[1]._id.toHexString();

    supertest(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token )
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById(hexId).then( (doc) => {
          // console.log(`<debug> doc:${doc}`);

          expect(doc).toNotExist()

          done()
        }).catch((e) => done(e))
      })
  });

  it('should not delete a todo doc owned by another user', (done) => {
    var hexId = todos[0]._id.toHexString();

    supertest(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token )
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById(hexId).then( (doc) => {
          // console.log(`<debug> doc:${doc}`);

          expect(doc).toExist()

          done()
        }).catch((e) => done(e))
      })
  });

  it('should return 404 if todo not found', (done) => {
    var id = (new ObjectID()).toHexString()

    supertest(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token )
      .expect(404)
      .end(done)

  })

  it('should return 404 if objectID is invalid', (done) => {
    supertest(app)
      .delete('/todos/123abc')
      .set('x-auth', users[1].tokens[0].token )
      .expect(404)
      .end(done)

  })
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var test_text = 'updated todo text'

      supertest(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token )
        .send({text: test_text, completed: true})
        .expect(200)
        .expect((res) => {
          // console.log('<debug2> res.body.todo.text: '+res.body.todo.text)
          expect(res.body.todo.text).toBe(test_text)
          expect(res.body.todo.completed).toBe(true)
          expect(res.body.todo.completedAt).toBeA('number')

        })
        .end(done)
    });

    it('should not update the todo created by another user', (done) => {
      var hexId = todos[0]._id.toHexString();
      var test_text = 'updated todo text'

      supertest(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token )
        .send({text: test_text, completed: true})
        .expect(404)
        .end(done)
    });

    it('should clear completedAt when todo is not completed', (done) => {
      var hexId = todos[2]._id.toHexString();
      var test_text = 'updated todo text #2'

      supertest(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token )
        .send( {text: test_text, completed: false} )
        .expect(200)
        .expect( (res) => {
          expect(res.body.todo.text).toBe(test_text)
          expect(res.body.todo.completed).toBe(false)
          expect(res.body.todo.completedAT).toNotExist()
        })
        .end(done)

    })
})

describe('GET /users/me', () => {
  it('should return user is authenticated', (done) => {
    supertest(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect( (res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString()) ;
        expect(res.body.email).toBe(users[0].email ) ;
      })
      .end(done);

  });

  it('should return 401 if not authenticated', (done) => {
    supertest(app)
      .get('/users/me')
      .expect(401)
      .expect( (res) => {
        expect(res.body).toEqual({}) ;
      })
      .end(done);
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'test10@example.com'
    var password = '123xyz!'

    supertest(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect( (res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then( (user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done() ;
        }).catch( (e) => done(e)) ;
      });

  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'test11@example.com'
    var password = '123'

    supertest(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = '123xxxxxx!'

    supertest(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });
})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    supertest(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end( (err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id).then( (user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch( (e) => done(e)) ;
      });
  });

  it('should reject invalid login ', (done) => {
    supertest(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '_doh!'
      })
      .expect(400)
      .expect( (res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end( (err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id).then( (user) => {
          // console.log('debug> user:'+user)
          expect(user.tokens.length).toBe(1);
          done();
        }).catch( (e) => done(e));
      })
  })
});

// } // END OF skip these tests ...

describe('DELETE /users/login/token', () => {
  it('should remove auth token on logout', (done) => {
    supertest(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end( (err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then( (user) => {
          // console.log('debug> user:'+user)
          expect(user.tokens.length).toBe(0);
          done();
        }).catch( (e) => done(e));
      });
  });
});
