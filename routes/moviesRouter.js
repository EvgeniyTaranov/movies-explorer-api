const moviesRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  validationMovieInfo,
  // validationMovieId,
} = require('../middlewares/validation');

const {
  getSavedMovies,
  postMovie,
  // deleteMovie,
} = require('../controllers/moviesController');

moviesRouter.use(auth);
moviesRouter.get('/', getSavedMovies);
moviesRouter.post('/', validationMovieInfo, postMovie);
// moviesRouter.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = moviesRouter;
