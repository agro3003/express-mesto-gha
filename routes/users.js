const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getAuthUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(true),
}), getAuthUserInfo);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(true),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(true),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).max(1000),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
