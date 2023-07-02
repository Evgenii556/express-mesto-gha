const mongoose = require('mongoose');
const { linTemplate } = require('../utils/constants');

const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Наименование карточки должно быть от 2 до 30 символов',
      },
    },

    link: {
      type: String,
      required: true,
      validate: {
        validator: (url) => linTemplate.test(url),
        message: 'Введите URL',
      },
    },

    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },

    likes: [
      {
        type: ObjectId,
        ref: 'user',
        default: [],
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
