const router = require('express').Router();

const {
  getUsersInfo,
  getUserInfoId,
  createUser,
  editAvatar,
  editUserInfo,
} = require('../controllers/users');

router.get('/', getUsersInfo);
router.get('/:userId', getUserInfoId);
router.post('/', createUser);
router.patch('/me', editUserInfo);
router.patch('/me/avatar', editAvatar);

module.exports = router;
