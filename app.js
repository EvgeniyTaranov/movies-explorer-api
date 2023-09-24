const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('./config/rateLimitConfig');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const INTERNAL_SERVER_ERROR = 500;
const { PORT = 4000, DATABASE_URL } = process.env;

const corsOptions = {
  origin: ['http://localhost:3000',
    'http://localhost:4000',
    'https://evgeniytaranovdiploma.nomoredomainsicu.ru',
    'http://evgeniytaranovdiploma.nomoredomainsicu.ru',
    'http://api.evgeniytaranovdiploma.nomoredomainsicu.ru',
    'https://api.evgeniytaranovdiploma.nomoredomainsicu.ru'],
  credentials: true,
};

const app = express();

app.use(helmet());

app.use(cookieParser());

app.use(requestLogger);

app.use(express.json());

app.use(cors(corsOptions));

app.use(rateLimit);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.use('/', errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
  next();
});

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
});
