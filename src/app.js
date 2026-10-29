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
    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600
        ? err.status
        : 500;
    if (status >= 500) {
        console.error(err);
    }
    const message = err.type === 'entity.parse.failed'
        ? 'Invalid JSON request body'
        : status < 500
            ? err.message
            : 'Server error';
    res.status(status).json({error: message});
})

module.exports = app;
