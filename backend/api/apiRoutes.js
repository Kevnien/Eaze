const express = require('express');
const router = express.Router();

const creationRoutes = require('./creationRoutes.js');

router.use('/create', creationRoutes);

module.exports = router;