// ./app/api/chat/route.ts
import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
	// Extract the `prompt` from the body of the request
	const { messages } = await req.json()

	// Ask OpenAI for a streaming chat completion given the prompt
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo-16k',
		stream: true,
		max_tokens: 2000,
		temperature: 0.5,
		messages: messages.map((message: any) => ({
			content: message.content,
			role: message.role,
		})),
	})

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response)
	// Respond with the stream
	return new StreamingTextResponse(stream)
}
