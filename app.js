const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/useer');
const { defaultError } = require('./middlewares/defaulterror');
const { auth } = require('./middlewares/auth');
const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/singin', login);

app.post('/singup', createUser);

app.use(auth);

app.use('/', cardsRouter);
app.use('/', usersRouter);

app.use('/', (req, res) => {
  res.status(401).send({ message: 'Страница не найдена' });
});

app.use(errors());
app.use(defaultError);

app.listen(PORT);
