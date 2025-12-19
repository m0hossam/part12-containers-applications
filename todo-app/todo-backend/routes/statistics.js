const express = require('express');
const redis_helper = require('../util/redis_helper');
const router = express.Router();

/* GET todos statistics */
router.get('/', async (_, res) => {
    const val = await redis_helper.getAsync()
    res.send({ key: val });
});

module.exports = router;
