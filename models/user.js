const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AuthError = require('../errors/AuthError');

const { linTemplate } = require('../utils/constants');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Введите электронный адрес',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: ({ length }) => length >= 6,
        message: 'Длина пароля должна быть от 6 символов',
      },
    },

    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Наименование пользователя должно быть от 2 до 30 символов',
      },
    },

    about: {
      type: String,
      default: 'Исследователь',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message:
          'Информация о пользователе должна быть от 2 до 30 символов',
      },
    },

    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => linTemplate.test(url),
        message: 'Введите URL',
      },
    },
  },

  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;

                return new AuthError('Некорректные почта или пароль');
              });
            }

            return new AuthError('Некорректные почта или пароль');
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
