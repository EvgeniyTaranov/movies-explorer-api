const moviesRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  validationMovieInfo,
  validationMovieId,
} = require('../middlewares/validation');

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/moviesController');

moviesRouter.use(auth);
moviesRouter.get('/', getMovies);
moviesRouter.post('/', validationMovieInfo, postMovie);
moviesRouter.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = moviesRouter;
