const express = require('express');
const UserRoutes = require('./user-routes');
const ClientRoutes = require('./client-routes');
const PostRoutes = require('./post-routes');
const GigRoutes = require('./gig-routes');
const LeadRoutes = require('./lead-routes');
const router = express.Router();

router.use('/user', UserRoutes);
router.use('/client', ClientRoutes);
router.use('/post', PostRoutes);
router.use('/lead', LeadRoutes);
router.use('/gig', GigRoutes);

module.exports = router;