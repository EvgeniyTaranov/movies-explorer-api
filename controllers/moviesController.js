const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const Movie = require('../models/movie');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
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
    movieId,
    nameRU,
    nameEN,
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
    movieId,
    nameRU,
    nameEN,
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
    const data = await Movie.findById(movieId);
    if (!data) {
      return next(new NotFoundError('Фильм с таким id не найден'));
    }
    if (data.owner.toString() !== req.user._id) {
      return next(new ForbiddenError('Вы не можете удалять чужие фильмы'));
    }
    const movie = await Movie.findByIdAndRemove(movieId);
    if (movie) {
      return res.send({ message: 'Фильм удален' });
    }
  } catch (err) {
    if (err instanceof castError) {
      next(new BadRequestError('Передан некорректный id фильма'));
    } else {
      next(err);
    }
  }
};
