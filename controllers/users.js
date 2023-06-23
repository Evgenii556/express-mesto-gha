const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Некорректный запрос к серверу при создании пользователя',
        });
      } else {
        res
          .status(500)
          .send({
            message: 'Сервер не может обработать запрос',
          });
      }
    });
};

module.exports.getUsersInfo = (_, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({
      message: 'Сервер не может обработать запрос',
    }));
};

module.exports.getUserInfoId = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Некорректный запрос к серверу при поиске пользователя',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res
        .status(500)
        .send({
          message: 'Сервер не может обработать запрос',
        });
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map((error) => error.message);
        return res.status(400).send({
          message: 'Некорректный запрос к серверу при обновлении аватара',
          validationErrors,
        });
      }
      return res.status(500).send({
        message: 'Сервер не может обработать запрос',
      });
    });
};

module.exports.editUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map((error) => error.message);
        return res.status(400).send({
          message: 'Некорректный запрос к серверу при обновлении профиля',
          validationErrors,
        });
      }
      return res.status(500).send({
        message: 'Сервер не может обработать запрос',
      });
    });
};
