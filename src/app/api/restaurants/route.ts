import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface LocationRequest {
  latitude: number
  longitude: number
  cuisine_type?: string
  meal_type?: string
}

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, cuisine_type, meal_type }: LocationRequest = await request.json()

    const prompt = `Com base na localização (latitude: ${latitude}, longitude: ${longitude}), sugira 5 restaurantes próximos que servem ${cuisine_type || 'comida variada'} para ${meal_type || 'qualquer refeição'}.

Retorne APENAS um JSON válido no seguinte formato (sem markdown):
{
  "restaurants": [
    {
      "name": "Nome do Restaurante",
      "address": "Endereço completo",
      "distance": "500m",
      "rating": 4.5,
      "cuisine_type": "Italiana"
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente que sugere restaurantes baseado em localização. Sempre responda APENAS com JSON válido.'
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
    const restaurantData = JSON.parse(cleanContent)

    return NextResponse.json(restaurantData)
  } catch (error) {
    console.error('Erro ao buscar restaurantes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar restaurantes próximos.' },
      { status: 500 }
    )
  }
}
