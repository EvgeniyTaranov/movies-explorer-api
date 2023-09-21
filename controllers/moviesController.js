const validationError = require('mongoose').Error.ValidationError;
const castError = require('mongoose').Error.CastError;
const Movie = require('../models/movie');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
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
    owner: req.user._id,
    movieId: req.movie._id,
  };

  Movie.create(movieData)
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err instanceof validationError) {
        next(new BadRequestError('Ошибка при валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (movie === null) {
        return next(new NotFoundError('Фильм с таким id не найден'));
      }
      if (!(movie.owner.toString() === req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалять чужие фильмы'));
      }
      Movie.findByIdAndRemove(movieId)
        // eslint-disable-next-line consistent-return
        .then((data) => {
          if (data) {
            return res.send({ message: 'Фильм удален' });
          }
        })
        .catch((err) => {
          if (err instanceof castError) {
            next(new BadRequestError('Передан некорректный id фильма'));
          } else { next(err); }
        });
    })
    .catch(next);
};
