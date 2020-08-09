const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com',
    },
  ],
};

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'));

//password should match with in the database
app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    'apples',
    '$2a$10$.pYtrpqwlqPegRgODV65eOo87YAeKeRmjjoIzF.eucFNAGgwEe9A6',
    function(err, res) {
      console.log('first guess', res); // res == true
    }
  );
  bcrypt.compare(
    'veggies',
    '$2a$10$.pYtrpqwlqPegRgODV65eOo87YAeKeRmjjoIzF.eucFNAGgwEe9A6',
    function(err, res) {
      console.log('second guess ', res); // res = false
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    // res.json('success');
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/findface', (req, res) => {
  database.users.forEach((user) => {
    if (user.email === req.body.email) {
      user.entries++;
      res.json(user);
    }
  });
  res.json('nope');
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user); //return user
    }
  });
  if (!found) {
    res.status(400).json('not found');
  }
});

// app.get('/profile/:userId', (req, res) => {
//   database.users.forEach((user) => {
//     if (user.id === req.params.userId) {
//       return res.json(user);
//     }
//   });
// res.json('no user')
// });
// update users image count
app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json('not found');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
  database.users.push({
    // push new user to database
    id: '125',
    name: name,
    email: email,
    // password: password, don't return password
    entries: 0,
    joined: new Date(),
  });
  return db('users')
    .returning('*') //return all the columns with the new user
    .insert({
      email: email[0],
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      //  res.json(database.users[database.users.length - 1]);
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json('unable to register')); //email must be unique, don't show reason to client
});
/*
/ --> res = this is working
/signin --> POST = SUCCESS/FAIL , pass from body, query strings not safe
/register --> POST = user
/profile/:useId --> GET = user
/image --> PUT  --> updated user's image count 
*/

app.listen(3000, () => console.log('Example app listening on port 3000!'));
