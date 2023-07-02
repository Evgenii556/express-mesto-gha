const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routeSignup = require('./routes/sign-up');
const routeSignin = require('./routes/sign-in');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routeSignup);
app.use('/', routeSignin);
app.use(auth);
app.use('/users', routeUsers);
app.use('/cards', routeCards);
app.use((req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден.')));
app.use(errors());
app.use(errorHandler);

mongoose
  .connect('mongodb://127.0.0.1:27017/mestod')
  .then(() => {
    console.log('Успешное подключение');
  })
  .catch(() => {
    console.log('Ошибка подключения');
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
