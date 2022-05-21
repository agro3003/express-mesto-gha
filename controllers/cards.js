const { Card } = require('../models/card');
const ErrorAuth = require('../errors/errorauth');
const ErrorBadRequest = require('../errors/errorsbadrequest');
const ErrorNotFound = require('../errors/errornotfound');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.removeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new ErrorNotFound('Карточка с указанным _id не найдена.');
      if (!card.owner.equals(req.user._id)) throw new ErrorAuth('Недостаточно прав для удаления');
      Card.findByIdAndDelete(req.params.cardId)
        .then((item) => {
          res.send(item);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new ErrorBadRequest('переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) throw new ErrorNotFound('Карточка с указанным _id не найдена.');
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) throw new ErrorNotFound('Карточка с указанным _id не найдена.');
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new ErrorBadRequest('переданы некорректные данные'));
      next(err);
    });
};
