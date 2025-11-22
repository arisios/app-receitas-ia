import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface PriceRequest {
  ingredients: string[]
  location?: string
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients, location }: PriceRequest = await request.json()

    const prompt = `Pesquise e estime os preços dos seguintes ingredientes em supermercados ${location ? `na região de ${location}` : 'no Brasil'}:

Ingredientes: ${ingredients.join(', ')}

Retorne APENAS um JSON válido no seguinte formato (sem markdown):
{
  "prices": [
    {
      "ingredient": "Nome do ingrediente",
      "price": "R$ 10-15",
      "store": "Supermercado exemplo",
      "location": "Localização"
    }
  ],
  "total_estimated": "R$ 50-70"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente que pesquisa preços de ingredientes em supermercados. Sempre responda APENAS com JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('Resposta vazia da OpenAI')
    }

    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const priceData = JSON.parse(cleanContent)

    return NextResponse.json(priceData)
  } catch (error) {
    console.error('Erro ao buscar preços:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar preços de ingredientes.' },
      { status: 500 }
    )
  }
}
