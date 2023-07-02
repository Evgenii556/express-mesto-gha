const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SecretKey } = require('../utils/constants');

const AuthError = require('../errors/AuthError');
// const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');
const InvalidError = require('../errors/InvalidError');

function registrationUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DuplicateError('Пользователь уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new InvalidError('Некорректный запрос к серверу при регистрации пользователя'));
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, SecretKey, {
          expiresIn: '7d',
        });
        return res.send({ _id: token });
      }
      throw new AuthError('Некорректные почта или пароль');
    })
    .catch(next);
}

function getUsersInfo(_, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
}

function getUserInfoId(req, res, next) {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) return res.send({ user });
      return res
        .status(404)
        .send({ message: 'Карточки не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidError('Передача некорректного id'));
      } else {
        next(err);
      }
    });
}

function getUserInfo(req, res, next) {
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (user) return res.send({ user });
      return res
        .status(404)
        .send({ message: 'Карточки не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidError('Передача некорректного id'));
      } else {
        next(err);
      }
    });
}

function editUserInfo(req, res, next) {
  const { name, about } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });
      return res
        .status(404)
        .send({ message: 'Карточки не существует' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InvalidError('Некорректный запрос к серверу при обновления профиля'));
      } else {
        next(err);
      }
    });
}

function editAvatar(req, res, next) {
  const { avatar } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });
      return res
        .status(404)
        .send({ message: 'Карточки не существует' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InvalidError('Некорректный запрос к серверу при обновления аватара'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUsersInfo,
  getUserInfoId,
  getUserInfo,
  editUserInfo,
  editAvatar,
  registrationUser,
  loginUser,
};
