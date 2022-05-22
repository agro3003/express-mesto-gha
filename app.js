const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const { defaultError } = require('./middlewares/defaulterror');
const { auth } = require('./middlewares/auth');
const { validateURL } = require('./middlewares/celebratecustom');
const {
  login,
  createUser,
} = require('./controllers/users');
const ErrorNotFound = require('./errors/errornotfound');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/', cardsRouter);
app.use('/', usersRouter);

app.use('/', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

app.use(errors());
app.use(defaultError);

app.listen(PORT);
