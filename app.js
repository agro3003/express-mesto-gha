const express = require('express');
const mongoose = require('mongoose');
const { userRouters } = require('./routes/users');
const { cardRouters } = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6279bb57010dfe85177b4b82',
  };

  next();
});
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});
app.use('/users', userRouters);
app.use('/cards', cardRouters);

app.listen(PORT);
