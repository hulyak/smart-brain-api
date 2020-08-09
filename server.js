const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const register = require('./controllers/register.js');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1', //localhost
    user: 'hulyakarakaya',
    password: '',
    database: 'smart-brain',
  },
});

db.select('*').from('users').then((data) => {
  console.log(data);
});

app.get('/', (req, res) => {
  // res.send(database.users);
  res.send('it is working')
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt); //inject db and bcrypt to register.js
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

//clarifai api connection
app.post('/imageUrl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT  || 3030, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

//POSTGRES SQL
// hyper -> desktop -> createdb smart-brain
// psql 'smart-brain'
//open postbird and connect to smart-brain

// CREATE TABLE users (
//   id serial PRIMARY KEY,
//   name varchar(100),
//   email text UNIQUE NOT NULL,
//   entries BIGINT DEFAULT 0,
//   joined TIMESTAMP NOT NULL
// );

// \d command shows the table postbird

// CREATE TABLE login (
// 	id SERIAL PRIMARY KEY,
//   hash varchar(100) NOT NULL,
//   email text UNIQUE NOT NULL
// );

//CONNECT TO  DATABASE TO SERVER
//https://github.com/vitaly-t/pg-promise
//http://knexjs.org/      node
