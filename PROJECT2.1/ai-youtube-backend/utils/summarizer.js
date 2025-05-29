const { InferenceClient } = require("@huggingface/inference");
const HF_TOKEN = process.env.HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);

const summarizeComments = async (texts) => {
  const inputText = `Summarize these YouTube comments with emotional and public opinion insights for a writer:\n\n${texts.slice(0, 50).join("\n")}`;

  const response = await client.chatCompletion({
    provider: "nebius",
    model: "mistralai/Mistral-Small-3.1-24B-Instruct-2503",
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: inputText }],
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { summarizeComments };
