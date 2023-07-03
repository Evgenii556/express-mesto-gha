const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { linTemplate } = require('../utils/constants');
const {
  getUsersInfo,
  getUserInfoId,
  getUserInfo,
  editUserInfo,
  editAvatar,
} = require('../controllers/users');

router.get('/', getUsersInfo);

router.get('/me', getUserInfo);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserInfoId,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  editUserInfo,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(linTemplate),
    }),
  }),
  editAvatar,
);

module.exports = router;
