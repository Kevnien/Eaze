const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(201).json({'message':'survey creation routes working'});
});

module.exports = router;