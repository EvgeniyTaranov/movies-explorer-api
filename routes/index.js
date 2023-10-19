const router = require('express').Router();
const userRouter = require('./usersRouter');
const moviesRouter = require('./moviesRouter');
const NotFoundError = require('../errors/notFoundError');

const {
  createUser,
  login,
  logout,
} = require('../controllers/usersController');

const {
  signinValidationSchema,
  signupValidationSchema,
} = require('../middlewares/validation');

router.post('/signin', signinValidationSchema, login);
router.post('/signup', signupValidationSchema, createUser);
router.get('/signout', logout);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Неверный путь'));
});

module.exports = router;
