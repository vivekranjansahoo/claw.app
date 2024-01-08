const express = require('express');
const UserRoutes = require('./user-routes');
const ClientRoutes = require('./client-routes');
const PostRoutes = require('./post-routes');
const router = express.Router();

router.use('/user', UserRoutes);
router.use('/client', ClientRoutes);
router.use('/post', PostRoutes);

module.exports = router;