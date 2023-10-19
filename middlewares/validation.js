const { Joi, celebrate } = require('celebrate');
const { isURL, isEmail } = require('validator');
const { ObjectId } = require('mongoose').Types;
const BadRequestError = require('../errors/badRequestError');

const validateURL = (URL) => {
  if (isURL(URL)) {
    return URL;
  }
  throw new BadRequestError(': invalid URL');
};

const validateEmail = (Email) => {
  if (isEmail(Email)) {
    return Email;
  }
  throw new BadRequestError(': invalid Email');
};

const validateId = (Id) => {
  if (ObjectId.isValid(Id)) {
    return Id;
  }
  throw new BadRequestError(': invalid Id');
};

module.exports.validationUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.signinValidationSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(6),
  }),
});

module.exports.signupValidationSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom(validateId),
  }),
});

module.exports.validationMovieInfo = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailerLink: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validationMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom(validateId),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validateId),
  }),
});
