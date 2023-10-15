const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Превышено число запросов с вашего IP. Пожалуйста, повторите попытку позже.',
});

module.exports = limiter;
