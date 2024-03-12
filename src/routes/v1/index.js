const express = require('express');
const UserRoutes = require('./user-routes');
const ClientRoutes = require('./client-routes');
const PostRoutes = require('./post-routes');
const GigRoutes = require('./gig-routes');
const GptRoutes = require('./gpt-routes');
const LeadRoutes = require('./lead-routes');
const BaseRoutes = require('./base-routes');
const BlogsRoutes = require('./blog-routes');
const MailingListRoutes = require('./mailingList-routes');
const router = express.Router();

router.use('/user', UserRoutes);
router.use('/client', ClientRoutes);
router.use('/post', PostRoutes);
router.use('/lead', LeadRoutes);
router.use('/', BaseRoutes);
router.use('/gig', GigRoutes);
router.use('/gpt', GptRoutes);
router.use('/blog', BlogsRoutes);
router.use('/mailinglist', MailingListRoutes);

module.exports = router;