const express = require('express');

const app = express();
const port = 8000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешить доступ с любого источника
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // Разрешить методы
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешить заголовки
    next();
  });

require('./routes')(app); // указываем папку  routes и передаем app

app.listen(port, ()=>{
    console.log('The server is running on port ' + port)
});