const express = require('express');
const UserRoutes = require('./user-routes');
const ClientRoutes = require('./client-routes');
const PostRoutes = require('./post-routes');
const GigRoutes = require('./gig-routes');
const LegalGPTRoutes = require('./legalGPT-routes');
const LeadRoutes = require('./lead-routes');
const BaseRouter = require('./base-routes');
const router = express.Router();

router.use('/user', UserRoutes);
router.use('/client', ClientRoutes);
router.use('/post', PostRoutes);
router.use('/lead', LeadRoutes);
router.use('/', BaseRouter);
router.use('/gig', GigRoutes);
router.use('/legalGPT', LegalGPTRoutes);

module.exports = router;