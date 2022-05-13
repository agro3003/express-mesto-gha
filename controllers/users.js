const { User } = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    if (err === 'CastError') {
      res.status(400).send({ message: 'переданы некорректные данные' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найдена.' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  if (!req.body.name || !req.body.about) {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  } else {
    User.findByIdAndUpdate(
      (req.user._id),
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true },
    )
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'Пользователь с указанным _id не найдена.' });
        } else {
          res.send(user);
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        } else {
          res.status(500).send({ message: 'Ошибка по умолчанию.' });
        }
      });
  }
};

module.exports.updateAvatar = (req, res) => {
  if (!req.body.avatar) {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  } else {
    User.findByIdAndUpdate(
      (req.user._id),
      { avatar: req.body.avatar },
      { new: true },
    )
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'Пользователь с указанным _id не найдена.' });
        } else {
          res.send(user);
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(400).send({ message: 'переданы некорректные данные' });
        } else {
          res.status(500).send({ message: 'Ошибка по умолчанию.' });
        }
      });
  }
};
