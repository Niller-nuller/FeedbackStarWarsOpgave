const express = require('express');
const path = require("path");
const logger = require('./middlewares/logger');
const routes = require('./routes/srcRoute');

const app = express();

app.use(express.json());
app.use(logger);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', routes);

app.use((req, res ) => {
    res.status(404).json({error: 'Page Not Found'})
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({error: err.message || 'server error'})
})

module.exports = app;
