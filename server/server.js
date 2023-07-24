const express = require('express');
const app = express();
const imagesRouter = require('./routes/images.router');
const testRouter = require('./routes/test.router')

app.use(express.json());
app.use('/test', testRouter);
app.use('/images', imagesRouter);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
