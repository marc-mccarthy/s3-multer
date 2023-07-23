const express = require('express');
const imageRouter = require('./routes/image.router');

const app = express();

app.use(express.json());
app.use('/api/images', imageRouter);

module.exports = app;
