const Card = require('../models/card');
const AccessError = require('../errors/AccessError');
const NotFoundError = require('../errors/NotFoundError');
const InvalidError = require('../errors/InvalidError');

function getCards(_, res, next) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

function addCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidError('Некорректный запрос к серверу при добавлении карточки'));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card.findById({
    _id: cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки не существует');
      }
      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId) {
        throw new AccessError('Нет прав доступа');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('Данная карточка была удалена');
      }
      res.send({ data: deletedCard });
    })
    .catch(next);
}

function addLike(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new NotFoundError('Карточки не существует');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidError('Некорректный запрос к серверу при установке лайка'));
      } else {
        next(err);
      }
    });
}

function deleteLike(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new NotFoundError('Карточки не существует');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidError('Некорректный запрос к серверу при установке лайка'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getCards,
  addCard,
  deleteCard,
  addLike,
  deleteLike,
};
