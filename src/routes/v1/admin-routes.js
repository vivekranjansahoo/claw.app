const express = require('express');
const router = express.Router();
const { getCollections, getData } = require('../../controllers/admin-controller'); 


router.get('/', getCollections);

router.get('/:collectionName', getData);

module.exports = router;
