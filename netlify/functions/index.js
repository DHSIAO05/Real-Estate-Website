const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const { createAssistant } = require("./openai.service");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

exports.handler = async function (event, context) {
  const { path, httpMethod, body } = event;

  if (path === "/chat" && httpMethod === "POST") {
    const { thread_id, message } = JSON.parse(body);
    if (!thread_id) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing thread_id" }) };
    }

    const assistant = await createAssistant(openai);
    await openai.beta.threads.messages.create(thread_id, {
      role: "user",
      content: message,
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread_id, {
      assistant_id: assistant.id,
    });

    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const response = messages.data[0].content[0].text.value;

    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  }

  return { statusCode: 404, body: "Not Found" };
};
