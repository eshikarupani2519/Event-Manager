const OpenAI = require("openai")

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
})

async function generateSummary(transcript){

const response = await openai.chat.completions.create({

model:"gpt-4o-mini",

messages:[
{
role:"system",
content:"Summarize this webinar into bullet points"
},
{
role:"user",
content:transcript
}
]

})

return response.choices[0].message.content

}

module.exports = generateSummary