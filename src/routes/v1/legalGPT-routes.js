const express = require('express');
const { LegalGPTController } = require('../../controllers/index');
const router = express.Router();


router.get('/createClient', LegalGPTController.createClient);
router.get('/createThread', LegalGPTController.createThread);

router.post('/generateResponse', LegalGPTController.generateResponse);
router.post('/conversationHistory', LegalGPTController.conversationHistory);

// router.post('/stream', async function (req, res, next) {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     // Simulate sending events periodically
//     console.log("generating response", req.body);
//     const { question, thread_id, assistant_id } = req.body;
//     if (!question || !thread_id || !assistant_id) return res.sendStatus(400);
//     next();
// }, answer_request_stream);


// router.post('/deleteThread', async function (req, res) {
//     const { thread_id } = req.body;
//     console.log("deleting thread", thread_id);

//     if (!thread_id) return res.sendStatus(400);

//     const response = await delete_thread(thread_id);
//     return res.json({ thread: response });
// })



module.exports = router;