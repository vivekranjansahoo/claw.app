const express = require('express');
const { answer_request, create_thread, create_client, conversation_history } = require('../../scripts/legalGPT');
const router = express.Router();


router.get('/createClient', async function (req, res) {
    const client_id = await create_client();
    return res.json({ client_id });
});


router.get('/createThread', async function (req, res) {
    const response = await create_thread();
    console.log("thread created", response);
    return res.json({ thread: response })
});

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

router.post('/generateResponse', async function (req, res) {
    console.log("generating response", req.body);
    const { question, thread_id, assistant_id } = req.body;
    if (!question || !thread_id || !assistant_id) return res.sendStatus(400);
    const gptResponse = await answer_request(question, thread_id, assistant_id);
    return res.json({ gptResponse });
});

// router.post('/deleteThread', async function (req, res) {
//     const { thread_id } = req.body;
//     console.log("deleting thread", thread_id);

//     if (!thread_id) return res.sendStatus(400);

//     const response = await delete_thread(thread_id);
//     return res.json({ thread: response });
// })


router.post('/conversationHistory', async function (req, res) {
    console.log("fetching history", req.body);
    const { thread_id } = req.body;
    if (!thread_id) return res.sendStatus(400);
    const conversationHistory = await conversation_history(thread_id);
    return res.json({ conversationHistory: conversationHistory.reverse() });
});

module.exports = router;