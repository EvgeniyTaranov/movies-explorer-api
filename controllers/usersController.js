const validationError = require('mongoose').Error.ValidationError;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id).select('-password')
    .then(((data) => res.send(data)))
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.send({ data: userWithoutPassword });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Данный email уже есть в базе'));
    } else if (err instanceof validationError) {
      next(new BadRequestError('Ошибка при валидации запроса'));
    } else {
      next(err);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    res.send({ data: user });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Данный Email уже используется'));
    } else if (err instanceof validationError) {
      next(new BadRequestError('Ошибка при валидации'));
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    const userAgent = req.get('User-Agent');
    const regEx = /Chrome\/\d+/;
    if (userAgent.match(regEx) && userAgent.match(regEx).toString().replace('Chrome/', '') > 80) {
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
    } else {
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'Strict',
      });
    }
    res.send({ jwt: token }).end();
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req, res) => {
  const userAgent = req.get('User-Agent');
  const regEx = /Chrome\/\d+/;
  if (userAgent.match(regEx) && userAgent.match(regEx).toString().replace('Chrome/', '') > 80) {
    res.clearCookie('jwt', {
      sameSite: 'None',
      secure: true,
    });
  } else {
    res.clearCookie('jwt', {
      sameSite: 'Strict',
    });
  }
  res.send({ message: 'Выход' });
};
