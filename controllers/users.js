const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const ErrorAuth = require('../errors/errorauth');
const ErrorBadRequest = require('../errors/errorsbadrequest');
const ErrorNotFound = require('../errors/errornotfound');
const ErrorEmailExist = require('../errors/erroremailexist');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'supersecrettoken';

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new ErrorNotFound('Пользователь с указанным _id не найдена.');
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    (req.user._id),
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) throw new ErrorNotFound('Пользователь с указанным _id не найдена.');
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  if (!req.body.avatar) throw new ErrorBadRequest('Переданы некорректные данные при обновлении профиля.');
  User.findByIdAndUpdate(
    (req.user._id),
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) throw new ErrorNotFound('Пользователь с указанным _id не найдена.');
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorBadRequest('переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!validator.isEmail(email)) throw new ErrorBadRequest('Формат данных неправельный');
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200).send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) next(new ErrorEmailExist('такой пользователь уже существует'));
      if (err.name === 'ValidationError') next(new ErrorBadRequest('переданы некорректные данные'));
      next(err);
    });
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  if (!validator.isEmail(email) || !password) throw new ErrorBadRequest('Формат данных неправельный');
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new ErrorAuth('Неправильная почта или пароль');
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) throw new ErrorAuth('Неправильная почта или пароль');
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

const getAuthUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getAuthUserInfo,
};
