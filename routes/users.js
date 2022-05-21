const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getAuthUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getAuthUserInfo);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
