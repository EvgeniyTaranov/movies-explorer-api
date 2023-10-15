const userRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  validationUserId,
  validationUserInfo,
} = require('../middlewares/validation');

const {
  getUserMe,
  getUserById,
  updateUser,
} = require('../controllers/usersController');

userRouter.use(auth);
userRouter.get('/me', getUserMe);
userRouter.get('/:id', validationUserId, getUserById);
userRouter.patch('/me', validationUserInfo, updateUser);

module.exports = userRouter;
