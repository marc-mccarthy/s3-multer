const express = require('express');
const app = express();
const imagesRouter = require('./routes/images.router');

app.use(express.json());
app.use('/api/images', imagesRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
