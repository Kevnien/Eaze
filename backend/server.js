const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');

const apiRoutes = require('./api/apiRoutes.js');

const server = express(); // framework for routing and middlewares

server.use(morgan('short')); // for API console logging
server.use(helmet()); // helps with security
server.use(cors()) // for corss-origin resource sharing
server.use(express.json()); // so JSON can be received and sent

server.use('/api', apiRoutes);

const port = 8000;

server.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});