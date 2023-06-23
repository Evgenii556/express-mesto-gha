const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({
      message: 'Сервер не может обработать запрос',
    }));
};

module.exports.addCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Некорректный запрос к серверу при добавлении карточки',
        });
      } else {
        res.status(500).send({
          message: 'Сервер не может обработать запрос',
        });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: 'Карточки не существует' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Некорректный запрос к серверу при удалении карточки',
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

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(404)
          .send({ message: 'Карточки не существует' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Некорректный запрос к серверу при установке лайка',
        });
      }
      return res
        .status(500)
        .send({
          message: 'Сервер не может обработать запрос',
        });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(404)
          .send({ message: 'Карточки не существует' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Некорректный запрос к серверу при удалении лайка',
        });
      }
      return res
        .status(500)
        .send({
          message: 'Сервер не может обработать запрос',
        });
    });
};
