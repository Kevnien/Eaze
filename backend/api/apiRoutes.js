const express = require('express');
const router = express.Router();

const creationRoutes = require('./creationRoutes.js');
const answerRoutes = require('./answerRoutes.js');

router.get('/', (req, res) => {
    res.status(200).json({message:"/api endpoint working"});
});

router.use('/create', creationRoutes);
router.use('/answer', answerRoutes);

module.exports = router;