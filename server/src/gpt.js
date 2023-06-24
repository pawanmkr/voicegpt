const { Configuration, OpenAIApi } = require("openai");
const path = require('path')
require('dotenv').config({
    path: path.join(process.cwd(), '../.env')
})

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let messages = []

exports.talkToGPT = async (userInput) => {
    messages.push({
        role: "user",
        content: userInput
    });
    try {
        let completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });
        if (completion && completion.data && completion.data.choices && completion.data.choices.length > 0) {
            const reply = {
                role: 'assistant',
                content: completion.data.choices[0].message.content,
            };
            console.log(`\nREPLY:\n${completion.data.choices[0].message.content}`);
            messages.push(reply);
            return completion.data.choices[0].message.content;
        } else {
            console.log('Unexpected response from the assistant. Please try again.');
            return;
        }
    } catch (error) {
        console.log('Error occurred while communicating with the assistant:', error);
    }
}