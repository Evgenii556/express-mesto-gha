const router = require('express').Router();

const {
  getCards,
  addCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', addCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId', deleteCard);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
