const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/router');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64959e5d12a21d167a26d396',
  };

  next();
});

app.use(routes);

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
