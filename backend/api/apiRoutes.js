const express = require('express');
const router = express.Router();

const creationRoutes = require('./creationRoutes.js');

router.get('/', (req, res) => {
    res.status(200).json({message:"/api endpoint working"});
});

router.use('/create', creationRoutes);

module.exports = router;