const express = require('express');
const { answer_request, create_thread, create_client, conversation_history } = require('../../scripts/legalGPT');
const router = express.Router();


router.get('/createClient', async function (req, res) {
    const client_id = await create_client();
    return res.json({ client_id });
});


router.get('/createThread', async function (req, res) {
    const thread_id = await create_thread();
    return res.json({ thread_id })
});



router.post('/generateResponse', async function (req, res) {
    console.log("generating response", req.body);
    const { question, thread_id, assistant_id } = req.body;
    if (!question || !thread_id || !assistant_id) return res.sendStatus(400);
    const gptResponse = await answer_request(question, thread_id, assistant_id);
    return res.json({ gptResponse });
});


router.post('/conversationHistory', async function (req, res) {
    console.log("fetching history", req.body);
    const { thread_id } = req.body;
    if (!thread_id) return res.sendStatus(400);
    const conversationHistory = await conversation_history(thread_id);
    return res.json({ conversationHistory: conversationHistory.reverse() });
});

module.exports = router;