const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Todo = require('./models/Todo')

mongoose.connect('mongodb+srv://MERN-TS-TODO:ramish123@cluster0.479umjq.mongodb.net/?retryWrites=true&w=majority')


app.use(cors());
app.use((bodyParser.json()));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', (req, res) => {
    console.log(req.body.username, req.body.password);
  const newUser = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10)
  });

  newUser.save(err => {
    if (err) {
      return res.status(400).json({
        title: 'error',
        error: 'Email already in use'
      })
    }
    return res.status(200).json({
      title: 'user successfully added'
    })
  })
});

app.post('/login', (req,res) => {
    User.findOne({ username: req.body.username}, (err, user) => {
      if (err) return res.status(500).json({
        title: 'server error',
        error: err
      });
      console.log(user);
      if (!user) {
        return res.status(400).json({
          title: 'user is not found',
          error: 'invalid username or password'
        })
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          title: 'login failed',
          error: 'invalid username or password'
        })
      }
  
      // authentication is done, give them a token
      let token = jwt.sign({ userId: user._id}, 'secretkey');
      return res.status(200).json({
        title: 'login successful',
        token: token
      });
    })
  });

  //get route for todos
  app.get('/todos', (req, res) => {

    jwt.verify(req.headers.token, 'secretkey', (err, decoded) => {
      if (err) return res.status(401).json({
        title: 'not authorized'
      });
  

      Todo.find({ author: decoded.userId }, (err, todos) => {
        if (err) return console.log(err);
  
        return res.status(200).json({
          title: 'success',
          todos: todos
        });
      })
    })
  })

  // mark todo as completed route
app.post('/todo',(req, res) => {
    // verify
    jwt.verify(req.headers.token, 'secretkey', (err, decoded) => {
      if (err) return res.status(401).json({
        title: 'not authorized'
      });
  
      let newTodo = new Todo({
        title: req.body.title,
        isCompleted: false,
        author: decoded.userId
      });
  
      newTodo.save(error => {
        if (error) return console.log(error);
        return res.status(200).json({
          title: "successfully added",
          todo: newTodo
        })
      })
    })
  });

  app.put('/todo/:todoId', (req, res) => {
    jwt.verify(req.headers.token, 'secretkey', (err, decoded) => {
      if (err) return res.status(401).json({
        title: 'not authorized'
      });
  
      // now we know token is valid
      Todo.findOne({ author: decoded.userId, _id: req.params.todoId }, (err, todo) => {
        if (err) return console.log(err);
  
        todo.isCompleted = true;
        todo.save(error => {
          if (error) return console.log(error);
  
          //saved
          return res.status(200).json({
            title: 'success',
            todo: todo
          });
        });
      })
    })
  })
  app.delete('/todo/:id', async (req,res) => {
      try {
          const deletee = await Todo.findByIdAndDelete(req.params.id);
          res.status(200).json('item deleted')
      } catch (error) {
          res.json(error)
      }
  })

//   Tank.deleteOne({ size: 'large' }, function (err) {
//     if (err) return handleError(err);
//     // deleted at most one tank document
//   });

const port = process.env.PORT || 5000;
app.listen(port, (err) => {
    if(err) return console.log(err)
    console.log('server runnin on port', port);
})