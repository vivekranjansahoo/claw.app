const OpenAI = require("openai");
const { OPEN_API_KEY } = require("../config/server-config");

const openai = new OpenAI({ apiKey: OPEN_API_KEY });

async function create_client() {
    const assistant = await openai.beta.assistants.create({
        name: "Lawyer",
        instructions: "Answer with respect to the Indian Constitution",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-3.5-turbo"
    })
    return assistant;
}

async function create_thread() {
    const thread = await openai.beta.threads.create();
    return thread;
}

async function answer_request(question, thread_id, assistant_id) {
    const initial_content = "Answer with respect to the Indian Constitution: ";
    const message = await openai.beta.threads.messages.create(thread_id, {
        role: "user",
        content: initial_content + question
    });
    const run = await openai.beta.threads.runs.create(thread_id, {
        assistant_id,
        instructions: "Answer with respect to the Indian Constitution"
    });

    let currRun = await openai.beta.threads.runs.retrieve(
        thread_id,
        run.id
    );

    while (currRun.status !== 'completed') {
        currRun = await openai.beta.threads.runs.retrieve(
            thread_id,
            run.id
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const messages = await openai.beta.threads.messages.list(thread_id);
    const response = messages.body.data
        .filter(({ run_id, role }) => (run_id === run.id && role === 'assistant'))
        .map(({ role, created_at, content, id }) => ({ role, created_at, id, text: content[0].text.value }));
    return response;
}

async function conversation_history(thread_id) {
    const messages = await openai.beta.threads.messages.list(thread_id);
    const response = messages.body.data.map(({ id, created_at, role, content }) => ({ id, created_at, role, text: content[0].text.value }));
    return response;
}

module.exports = {
    create_client,
    create_thread,
    answer_request,
    conversation_history,
}
