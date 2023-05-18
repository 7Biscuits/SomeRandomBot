const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);
async function ask(prompt) {
    const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return response.data.choices[0].text;
}

async function generate_image(prompt) {
    const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: '512x512'
    });
    return response.data.data[0].url;
}

async function moderation(message) {
    const response = await openai.createModeration({
        prompt: message,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return response['results'][0];
}

async function fill_mask(input) {
    const payload = {
        inputs: {
            text: input
        },
        options: {
            wait_for_model: true
        }
    };
    const response = await fetch(
        "https://api-inference.huggingface.co/models/bert-base-uncased",
        {
            headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` },
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
    return await response.json()[0].sequence;
}

async function chat(input) {
    const payload = {
        inputs: {
            text: input
        },
        options: {
            wait_for_model: true
        }
    };
    const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', 
        {
            headers: { Authorization: `Bearer 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` },
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
    const data = await response.json();
    return data.generated_text;
}

module.exports = {
    ask,
    generate_image,
    moderation,
    fill_mask,
    chat
}