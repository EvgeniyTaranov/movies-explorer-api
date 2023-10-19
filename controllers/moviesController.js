const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const Movie = require('../models/movie');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const movies = await Movie.find({ owner: userId });
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.postMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  const movieData = {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  };

  try {
    const movie = await Movie.create(movieData);
    res.send({ data: movie });
  } catch (err) {
    if (err instanceof validationError) {
      next(new BadRequestError('Ошибка при валидации'));
    } else {
      next(err);
    }
  }
};

// eslint-disable-next-line consistent-return
module.exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return next(new NotFoundError('Фильм с таким id не найден'));
    }

    if (!(movie.owner.toString() === req.user._id)) {
      return next(new ForbiddenError('Вы не можете удалять чужие фильмы'));
    }

    const deletedMovie = await Movie.findByIdAndRemove(movieId);

    if (deletedMovie) {
      res.send({ message: 'Фильм удален' });
    }
  } catch (err) {
    if (err instanceof castError) {
      next(new BadRequestError('Передан некорректный id фильма'));
    } else {
      next(err);
    }
  }
};
