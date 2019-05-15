const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(201).json({'message':'survey creation routes working'});
});

router.post('/', (req, res) => {
    const survey = req.body;
    const message = "endpoint received survey but survey addition to server not yet supported.";
    res.status(200).json({message, survey});
});

module.exports = router;