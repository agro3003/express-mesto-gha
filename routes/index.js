const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { auth } = require('../middlewares/auth');
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const { validateURL } = require('../middlewares/celebratecustom');
const {
  login,
  createUser,
} = require('../controllers/users');
const ErrorNotFound = require('../errors/errornotfound');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/', cardsRouter);
router.use('/', usersRouter);

router.use('/', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

module.exports = router;
