const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./src/routes/srcRoute');

app.use(express.json());
app.use('', routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});